// components/TokenSwap.tsx
import React, { useState } from 'react';
import Web3 from 'web3';

interface TokenSwapProps {
  token1Contract: any; // Replace with the correct type
  token2Contract: any; // Replace with the correct type
}

const TokenSwap: React.FC<TokenSwapProps> = ({ token1Contract, token2Contract }) => {
  const [amount, setAmount] = useState<string>('');
  
  const handleSwap1to2 = async () => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const from = accounts[0];

    const amountInWei = Web3.utils.toWei(amount, 'ether');
    await token1Contract.methods.swapToken1ForToken2(amountInWei).send({ from });
  };

  const handleSwap2to1 = async () => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const from = accounts[0];

    const amountInWei = Web3.utils.toWei(amount, 'ether');
    await token2Contract.methods.swapToken2ForToken1(amountInWei).send({ from });
  };

  return (
    <div>
      <h2>Token Swap</h2>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount to swap"
      />
      <button onClick={handleSwap1to2}>Swap MyToken to MyToken2</button>
      <button onClick={handleSwap2to1}>Swap MyToken2 to MyToken</button>
    </div>
  );
};

export default TokenSwap;
