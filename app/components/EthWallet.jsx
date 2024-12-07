"use client";
import { mnemonicToSeed } from 'bip39';
import { HDNodeWallet, Wallet } from 'ethers';
import React, { useState } from 'react'

const EthWallet = ({mnemonic}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [addresses, setAddresses] = useState([]);

    async function createWallet() {
        const seed = await mnemonicToSeed(mnemonic);
        const derivationPath = `m/44'/60'/${currentIndex}'/0'`;
        const hdNode = HDNodeWallet.fromSeed(seed);
        const child = hdNode.derivePath(derivationPath);
        const privateKey = child.privateKey;
        const wallet = new Wallet(privateKey);
        setCurrentIndex(currentIndex + 1);
        setAddresses([...addresses, wallet.address]);
    }
    return (
        <div className='text-center '>
            <button className='border-2 p-2 mb-3 rounded-xl bg-amber-800' onClick={createWallet}>Add Eth Wallet</button>
            {addresses.map((p, index) => 
                <div className=" mb-2" key={index++}>
                    Wallet {index+1} - <span className="underline underline-offset-[6px]">{p}</span>
                </div>)
            }
        </div>
    )
}

export default EthWallet