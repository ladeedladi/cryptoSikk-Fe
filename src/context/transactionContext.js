import React,{useEffect,useState,createContext} from "react";
import {ethers} from "ethers";

import {contractABI,contractAddress} from "../utils/constants"

export const TransactionContext=createContext()

const {ethereum}=window

const getEthContract=()=>{
  const provider=new ethers.providers.Web3Provider(ethereum)
  const signer=provider.getSigner()

  const transactionContract=new ethers.Contract(contractAddress,contractABI,signer)


  return transactionContract

}


export const TransactionProvider=({children})=>{
    const [account,setAccount]=useState("")
    const [formData,setFormData]=useState({addressTo:"",amount:"",keyword:"",message:""})
    const [isLoading,setIsLoading]=useState(false)
    const [transactions, settransactionCount] = useState("");
    const [balance,setBalance] = useState(0)


    const getAllTransactions = async () => {
        try {
          if (ethereum) {
            const transactionsContract = getEthContract();
    
            const availableTransactions = await transactionsContract.getAllTransaction();
    
            const structuredTransactions = availableTransactions.map((transaction) => ({
              addressTo: transaction.receiver,
              addressFrom: transaction.sender,
              timestamp: new Date(transaction.timestamp.toNumber() * 1000).toLocaleString(),
              message: transaction.message,
              keyword: transaction.keyword,
              amount: parseInt(transaction.amount._hex) / (10 ** 18)
            }));
    
            console.log(structuredTransactions);
    
            settransactionCount(structuredTransactions);
          } else {
            console.log("Ethereum is not present");
          }
        } catch (error) {
          console.log(error);
        }
      };



    const handleChange=(e,name)=>{
       console.log(name,e.target.value);
        setFormData((prevState) => ({ ...prevState, [name]: e.target.value }));
          
    }
    const accountHandler=(acc)=>{
        setAccount(acc)
        getUserBalance(acc)
    }
    const getUserBalance=async(acc)=>{
        const balanceAcc=await ethereum.request({method:"eth_getBalance",params:[acc,"latest"]})
        setBalance(ethers.utils.formatEther(balanceAcc))

    }
    const connectToWallet=async()=>{
        try{

            if(window.ethereum){
                console.log("success");
               const result= await window.ethereum.request({method:"eth_requestAccounts"})
              
               accountHandler(result[0])
               if(result.length){

                   getAllTransactions()
               }
               
            }else{
                alert("please install metamask")
            }
        }catch(err){
            console.log(err);
        }
        }

        const sendTransaction=async()=>{
          try{
            const {addressTo,amount,keyword,message}=formData
            console.log("sendTransaction");
            const transactionContract=getEthContract()
            const parsedAmount=ethers.utils.parseEther(amount)
            await ethereum.request({
                method:"eth_sendTransaction",
                params:[{
                    from:account,
                    to:addressTo,
                    gas:"0x5208",
                    value:parsedAmount._hex
                }]
            })
            const addToBC=await transactionContract.addToblockChain(addressTo,parsedAmount,message,keyword)
            setIsLoading(true)
            console.log("loading",addToBC.hash);
            await addToBC.wait()
            setIsLoading(false)
            console.log("success",addToBC.hash);

            
           

          }catch(err){
            console.log(err);
          }
        }
return(
    <TransactionContext.Provider value={{connectToWallet,account,formData,setFormData,handleChange,sendTransaction,isLoading,balance,transactions}}>
        {children}
    </TransactionContext.Provider>
)
}