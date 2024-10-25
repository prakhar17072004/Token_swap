// components/MyToken2.tsx
import React, { useEffect, useState } from 'react';
import Web3 from 'web3';

interface MyToken2Props {
  tokenContract: any; // Replace with the specific contract type if available
}

const MyToken2: React.FC<MyToken2Props> = ({ tokenContract }) => {
  const [amount, setAmount] = useState<string>('');
  const [recipient, setRecipient] = useState<string>('');
  const [balance, setBalance] = useState<string>('0');
  const [decimals, setDecimals] = useState<number>(18);
  const [tokenName, setTokenName] = useState<string>('');
  const [tokenSymbol, setTokenSymbol] = useState<string>('');

  useEffect(() => {
    const fetchTokenDetails = async () => {
      try {
        const accounts = await (window.ethereum as any).request({ method: 'eth_requestAccounts' });
        const from = accounts[0];

        const fetchedBalance = await tokenContract.methods.balanceOf(from).call();
        const fetchedDecimals = await tokenContract.methods.decimals().call();
        const fetchedName = await tokenContract.methods.name().call();
        const fetchedSymbol = await tokenContract.methods.symbol().call();

        setBalance(Web3.utils.fromWei(fetchedBalance, 'ether'));
        setDecimals(Number(fetchedDecimals));
        setTokenName(fetchedName);
        setTokenSymbol(fetchedSymbol);
      } catch (error) {
        console.error('Error fetching token details', error);
      }
    };

    fetchTokenDetails();
  }, [tokenContract]);

  const handleTransfer = async () => {
    if (!recipient || !amount) {
      console.error('Recipient address or amount is missing');
      return;
    }

    try {
      const accounts = await (window.ethereum as any).request({ method: 'eth_requestAccounts' });
      const from = accounts[0];

      const amountInWei = Web3.utils.toWei(amount, 'ether');
      await tokenContract.methods.transfer(recipient, amountInWei).send({ from });
      console.log(`Transferred ${amount} tokens to ${recipient}`);
    } catch (error) {
      console.error('Transfer failed', error);
    }
  };

  const handleApprove = async () => {
    if (!amount) {
      console.error('Amount is missing for approval');
      return;
    }

    try {
      const accounts = await (window.ethereum as any).request({ method: 'eth_requestAccounts' });
      const from = accounts[0];
      const amountInWei = Web3.utils.toWei(amount, 'ether');

      await tokenContract.methods.approve(tokenContract._address, amountInWei).send({ from });
      console.log(`Approved ${amount} ${tokenSymbol} for transfer`);
    } catch (error) {
      console.error('Approval failed', error);
    }
  };

  return (
    <div className="border border-gray-300 p-5 rounded-lg max-w-md mx-auto shadow-lg bg-white">
      <h2 className="text-2xl font-semibold mb-4">Token2 ({tokenSymbol})</h2>
      <p className="mb-2">Balance: {balance} {tokenSymbol}</p>
      <input
        type="text"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
        placeholder="Recipient Address"
        className="w-full px-3 py-2 mb-3 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-green-200"
      />
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder={`Amount to send (${tokenSymbol})`}
        className="w-full px-3 py-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-green-200"
      />
      <button
        onClick={handleTransfer}
        className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Transfer {tokenSymbol}
      </button>
      <button
        onClick={handleApprove}
        className="w-full py-2 bg-blue-600 text-white mt-2 rounded hover:bg-blue-700"
      >
        Approve {tokenSymbol} Transfer
      </button>
    </div>
  );
};

export default MyToken2;
