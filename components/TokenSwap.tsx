// components/TokenSwapUI.tsx
import React, { useEffect, useState } from 'react';
import Web3 from 'web3';

interface TokenSwapProps {
  tokenSwapContract: any; // The TokenSwap contract instance
  token1Contract: any;     // Token1 contract instance
  token2Contract: any;     // Token2 contract instance
}

const TokenSwapUI: React.FC<TokenSwapProps> = ({ tokenSwapContract, token1Contract, token2Contract }) => {
  const [amount, setAmount] = useState<string>('');
  const [exchangeRate1To2, setExchangeRate1To2] = useState<string>('');
  const [exchangeRate2To1, setExchangeRate2To1] = useState<string>('');
  const [balanceToken1, setBalanceToken1] = useState<string>('');
  const [balanceToken2, setBalanceToken2] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      const accounts = await (window.ethereum as any).request({ method: 'eth_requestAccounts' });
      const account = accounts[0];

      // Fetch exchange rates
      const rate1To2 = await tokenSwapContract.methods.exchangeRateToken1ToToken2().call();
      const rate2To1 = await tokenSwapContract.methods.exchangeRateToken2ToToken1().call();
      setExchangeRate1To2(rate1To2);
      setExchangeRate2To1(rate2To1);

      // Fetch token balances for the connected account
      const balance1 = await token1Contract.methods.balanceOf(account).call();
      const balance2 = await token2Contract.methods.balanceOf(account).call();
      setBalanceToken1(Web3.utils.fromWei(balance1, 'ether'));
      setBalanceToken2(Web3.utils.fromWei(balance2, 'ether'));
    };

    fetchData();
  }, [tokenSwapContract, token1Contract, token2Contract]);

  const handleSwap1to2 = async () => {
    const accounts = await (window.ethereum as any).request({ method: 'eth_requestAccounts' });
    const from = accounts[0];
    const amountInWei = Web3.utils.toWei(amount, 'ether');
    await tokenSwapContract.methods.swapToken1ForToken2(amountInWei).send({ from });
    // Re-fetch balances after swap
    fetchBalances(from);
  };

  const handleSwap2to1 = async () => {
    const accounts = await (window.ethereum as any).request({ method: 'eth_requestAccounts' });
    const from = accounts[0];
    const amountInWei = Web3.utils.toWei(amount, 'ether');
    await tokenSwapContract.methods.swapToken2ForToken1(amountInWei).send({ from });
    // Re-fetch balances after swap
    fetchBalances(from);
  };

  const fetchBalances = async (account: string) => {
    const balance1 = await token1Contract.methods.balanceOf(account).call();
    const balance2 = await token2Contract.methods.balanceOf(account).call();
    setBalanceToken1(Web3.utils.fromWei(balance1, 'ether'));
    setBalanceToken2(Web3.utils.fromWei(balance2, 'ether'));
  };

  return (
    <div className="border border-gray-300 p-5 rounded-lg max-w-md mx-auto shadow-lg bg-white">
      <h2 className="text-2xl font-semibold mb-4">Token Swap</h2>
      <p className="mb-2">Exchange Rate (Token1 to Token2): {exchangeRate1To2}</p>
      <p className="mb-4">Exchange Rate (Token2 to Token1): {exchangeRate2To1}</p>

      <p className="mb-2">Your Balance (Token1): {balanceToken1}</p>
      <p className="mb-4">Your Balance (Token2): {balanceToken2}</p>

      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount to swap"
        className="w-full px-3 py-2 mb-3 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-200"
      />
      <button
        onClick={handleSwap1to2}
        className="w-full py-2 mb-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Swap MyToken1 to MyToken2
      </button>
      <button
        onClick={handleSwap2to1}
        className="w-full py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
      >
        Swap MyToken2 to MyToken1
      </button>
    </div>
  );
};

export default TokenSwapUI;
