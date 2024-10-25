// pages/index.tsx
import React, { useEffect, useState } from 'react';
import "../app/globals.css"; // Ensure Tailwind CSS is imported
import Web3 from 'web3';
import TokenSwap from '../components/TokenSwap';
import MyToken1 from '../components/MyToken1'; 
import MyToken2 from '../components/MyToken2'; 
import Token1ABI from '../abis/Token1.json'; 
import Token2ABI from '../abis/Token2.json'; 
import SwapTokenABI from '../abis/SwapToken.json'; 

// Define types for the contracts
type Contract = {
  methods: {
    [key: string]: (...args: any[]) => any; 
  };
};

const Home: React.FC = () => {
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [myToken1Contract, setMyTokenContract] = useState<Contract | null>(null);
  const [myToken2Contract, setMyToken2Contract] = useState<Contract | null>(null);
  const [tokenSwapContract, setTokenSwapContract] = useState<Contract | null>(null);

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum as any);
        setWeb3(web3Instance);
  
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
  
          const networkId = await web3Instance.eth.net.getId();
          const myToken1Address = "0x487697BA791CD4dEd7A9C6769915c55E71bECEA0";
          const myToken2Address = "0xe5806B516d9609F34C07a57dE45bEE5E168Af6A9";
          const tokenSwapAddress = "0xDc30311cD698e8D625444A43b5aCe08aF2C9FAFB";
  
          if (!myToken1Address || !myToken2Address || !tokenSwapAddress) {
            console.error('Contracts not deployed on the current network');
            return;
          }
  
          const myToken1ContractInstance = new web3Instance.eth.Contract(Token1ABI, myToken1Address);
          const myToken2ContractInstance = new web3Instance.eth.Contract(Token2ABI, myToken2Address);
          const tokenSwapContractInstance = new web3Instance.eth.Contract(SwapTokenABI, tokenSwapAddress);
  
          setMyTokenContract(myToken1ContractInstance);
          setMyToken2Contract(myToken2ContractInstance);
          setTokenSwapContract(tokenSwapContractInstance);
        } catch (error) {
          console.error("User denied account access or error occurred", error);
        }
      } else {
        console.error('Ethereum provider not found. Please install MetaMask.');
      }
    };
  
    init();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-5">
      <h1 className="text-4xl font-bold mb-10">Token Swap dApp</h1>
      <div className="w-full max-w-3xl bg-white rounded-lg shadow-md p-6">
        {myToken1Contract && <MyToken1 tokenContract={myToken1Contract} />}
        {myToken2Contract && <MyToken2 tokenContract={myToken2Contract} />}
        {tokenSwapContract && (
          <TokenSwap 
            tokenSwapContract={tokenSwapContract} 
            token1Contract={myToken1Contract} 
            token2Contract={myToken2Contract} 
          />
        )}
      </div>
    </div>
  );
};

export default Home;
