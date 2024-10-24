// pages/index.tsx
import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import TokenSwap from '../components/TokenSwap';
import MyToken from '../components/MyToken1'; // Adjust if needed
import MyToken2 from '../components/MyToken2'; // Adjust if needed
//import MyTokenArtifact from '../artifacts/MyToken.json'; // Adjust path based on your structure
//import MyToken2Artifact from '../artifacts/MyToken2.json'; // Adjust path based on your structure
//import TokenSwapArtifact from '../artifacts/TokenSwap.json'; // Adjust path based on your structure

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
        const myTokenAddress = MyTokenArtifact.networks[networkId]?.address;
        const myToken2Address = MyToken2Artifact.networks[networkId]?.address;
        const tokenSwapAddress = TokenSwapArtifact.networks[networkId]?.address;

        if (!myTokenAddress || !myToken2Address || !tokenSwapAddress) {
          console.error('Contracts not deployed on the current network');
          return;
        }

        const myTokenContractInstance = new web3Instance.eth.Contract(MyTokenArtifact.abi, myTokenAddress);
        const myToken2ContractInstance = new web3Instance.eth.Contract(MyToken2Artifact.abi, myToken2Address);
        const tokenSwapContractInstance = new web3Instance.eth.Contract(TokenSwapArtifact.abi, tokenSwapAddress);

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
      <h1>Token Swap DApp</h1>
      {myTokenContract && <MyToken tokenContract={myTokenContract} />}
      {myToken2Contract && <MyToken2 tokenContract={myToken2Contract} />}
      {tokenSwapContract && (
        <TokenSwap token1Contract={myTokenContract} token2Contract={myToken2Contract} />
      )}
    </div>
  );
};

export default Home;
