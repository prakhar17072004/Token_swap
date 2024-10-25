// pages/index.tsx
import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import TokenSwap from '../components/TokenSwap';
import MyToken from '../components/MyToken1'; // Adjust if needed
import MyToken2 from '../components/MyToken2'; // Adjust if needed
import Token1ABI from '../abis/Token1.json'; // Adjust path based on your structure
import Token2ABI from '../abis/Token2.json'; // Adjust path based on your structure
import SwapTokenABI from '../abis/SwapToken.json'; // Adjust path based on your structure

// Define types for the contracts
type Contract = {
  methods: {
    [key: string]: (...args: any[]) => any; // Adjust to specific method signatures as needed
  };
};

const Home: React.FC = () => {
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [myTokenContract, setMyTokenContract] = useState<Contract | null>(null);
  const [myToken2Contract, setMyToken2Contract] = useState<Contract | null>(null);
  const [tokenSwapContract, setTokenSwapContract] = useState<Contract | null>(null);

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);

        // Request account access if needed
        await window.ethereum.request({ method: 'eth_requestAccounts' });

        const networkId = await web3Instance.eth.net.getId();

        // Check if contracts exist on the current network
        const myTokenAddress ="0x487697BA791CD4dEd7A9C6769915c55E71bECEA0";
        const myToken2Address = "0xe5806B516d9609F34C07a57dE45bEE5E168Af6A9";
        const tokenSwapAddress ="0xDc30311cD698e8D625444A43b5aCe08aF2C9FAFB";

        if (!myTokenAddress || !myToken2Address || !tokenSwapAddress) {
          console.error('Contracts not deployed on the current network');
          return;
        }

        const myTokenContractInstance = new web3Instance.eth.Contract(Token1ABI, myTokenAddress);
        const myToken2ContractInstance = new web3Instance.eth.Contract(Token2ABI, myToken2Address);
        const tokenSwapContractInstance = new web3Instance.eth.Contract(SwapTokenABI, tokenSwapAddress);

        setMyTokenContract(myTokenContractInstance);
        setMyToken2Contract(myToken2ContractInstance);
        setTokenSwapContract(tokenSwapContractInstance);
      } else {
        console.error('Ethereum provider not found. Please install MetaMask.');
      }
    };

    init();
  }, []);

  return (
    <div>
      <h1>Token Swap dApp</h1>
      {myTokenContract && <MyToken tokenContract={myTokenContract} />}
      {myToken2Contract && <MyToken2 tokenContract={myToken2Contract} />}
      {tokenSwapContract && (
        <TokenSwap token1Contract={myTokenContract} token2Contract={myToken2Contract} />
      )}
    </div>
  );
};

export default Home;
