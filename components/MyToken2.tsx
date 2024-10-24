// components/MyToken2.tsx
import React, { useState } from 'react';
import Web3 from 'web3';

interface MyToken2Props {
  tokenContract: any; // Replace with the correct type
}

const MyToken2: React.FC<MyToken2Props> = ({ tokenContract }) => {
  const [amount, setAmount] = useState<string>('');

  const handleTransfer = async () => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const from = accounts[0];

    const amountInWei = Web3.utils.toWei(amount, 'ether');
    await tokenContract.methods.transfer(/* recipient address */, amountInWei).send({ from });
  };

  return (
    <div>
      <h2>MyToken2</h2>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount to send"
      />
      <button onClick={handleTransfer}>Transfer MyToken2</button>
    </div>
  );
};

export default MyToken2;
