import React,{useState,useContext} from 'react';
import Loader from './Loader'
import {ethers} from 'ethers';
import {TransactionContext} from "../context/transactionContext"

const Welcome = () => {
    const {connectToWallet,account,formData,sendTransaction,handleChange,isLoading,balance}=useContext(TransactionContext)
    // console.log(value);
 
   const handleSumbit=(e)=>{
 
     const {addressTo,amount,keyword,message}=formData
     e.preventDefault()
     console.log(formData);
     if(!addressTo || !amount ||!keyword ||!message){
         console.log(addressTo,amount,keyword,message);
         return
     }
     sendTransaction()
   }


   

    // const Input=({placeholder,name,type,handleChange})=>{
    //     return(
    //         <input
    //          placeholder={placeholder} 
    //          name={name} 
    //          type={type}
    //          step="0.01"
    //          onChange={(e)=>handleChange(e,name)}
             
    //          className='my-2 w-full rounded-sm p-2 outline-none white-glassmorphism'
    //         />
    //     ) 
    // }
  return (
      <div className="flex h-1/2 py-20">
          <div className="flex flex-col flex-1 justify-center items-center 	h-2/6 text-gray-500">
              <h1 className="text-5xl">CryptoSikk</h1>
              <p className="p-5">sikk some comments blah blah blah</p>
              <h3 className="pb-3">adresss:{account}</h3>
              <h3 className="pb-3">balance:{balance} eth</h3>
              <button onClick={connectToWallet} className="bg-gray-700 p-2 rounded-md hover:bg-green-500">connect to wallet</button>
          </div>
  <div className="p-5 blue-glassmorphism flex flex-1 h-min	  flex-col ">
      <input  className='my-2 w-full rounded-sm p-2 outline-none white-glassmorphism' placeholder="Address To" name="addressTo" type="text"  onChange={(e)=>handleChange(e,e.target.name)} />
      <input  className='my-2 w-full rounded-sm p-2 outline-none white-glassmorphism' step="0.0001" placeholder="Amount (ETH)" name="amount" type="number" onChange={(e)=>handleChange(e,e.target.name)}/>
      <input  className='my-2 w-full rounded-sm p-2 outline-none white-glassmorphism' placeholder="Keyword (GIF)" name="keyword" type="text"  onChange={(e)=>handleChange(e,e.target.name)}/>
      <input  className='my-2 w-full rounded-sm p-2 outline-none white-glassmorphism' placeholder="Enter message" name="message" type="text"  onChange={(e)=>handleChange(e,e.target.name)}/>
      <div className="h-[1px] w-full bg-gray-400 my-2 md:hidden" >

      </div>
      {!isLoading?(<button className="p-2 bg-green-500 rounded-md text-white-500 hover:bg-green-300" onClick={handleSumbit}>
         send
      </button>):(<Loader/>)}
      
  </div>
  </div>);
};

export default Welcome;
