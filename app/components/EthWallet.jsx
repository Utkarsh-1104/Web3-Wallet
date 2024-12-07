"use client";
import axios from 'axios';
import { mnemonicToSeed } from 'bip39';
import { HDNodeWallet, Wallet } from 'ethers';
import React, { useEffect, useState } from 'react'

const EthWallet = ({mnemonic}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [addresses, setAddresses] = useState([]);

    async function createWallet() {
        setBalance('');
        const seed = await mnemonicToSeed(mnemonic);
        const derivationPath = `m/44'/60'/${currentIndex}'/0'`;
        const hdNode = HDNodeWallet.fromSeed(seed);
        const child = hdNode.derivePath(derivationPath);
        const privateKey = child.privateKey;
        const wallet = new Wallet(privateKey);
        setCurrentIndex(currentIndex + 1);
        setAddresses([...addresses, wallet.address]);
    }

    const [balance, setBalance] = useState('');

    async function getBalance (p) {
        console.log(p);
        const res = await axios.post("https://eth-mainnet.g.alchemy.com/v2/cF1alOQQ47lqaUIoTsSy0023M2OsQZeo", {
            "jsonrpc": "2.0",
            "id": 1,
            "method": "eth_getBalance",
            "params": [p, "latest"]
        })
        setBalance(res.data.result);
    }
    return (
        <div className='text-center '>
            <button className='border-2 p-2 mb-3 rounded-xl bg-amber-800' onClick={createWallet}>Add Eth Wallet</button>
            {addresses.map((p, index) => 
                <div className=" mb-2" key={index++}>
                    Wallet {index+1} - <span className="underline underline-offset-[6px]">{p}</span>
                    <button className='ms-2 border-b-2 border-dotted font-bold p-2 rounded-2xl' onClick={getBalance.bind(this, p) }>Get balance</button>
                </div>)
            }
            {balance !== "" && <Balance balance={balance} />}
            {/* <div className='text-white'>{res}</div> */}
        </div>
    )
}

export default EthWallet

function Balance({balance}) {
    return (
        <div className='text-white text-2xl'>Balance - {balance}</div>
    )
}