import { useState } from "react"
import { mnemonicToSeed } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import nacl from "tweetnacl"
import axios from "axios";

export function SolanaWallet({ mnemonic }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [publicKeys, setPublicKeys] = useState([]);

    async function generateWallet() {
        setBalance('');
        const seed = await mnemonicToSeed(mnemonic);
        const path = `m/44'/501'/${currentIndex}'/0'`;
        const derivedSeed = derivePath(path, seed.toString("hex")).key;
        const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
        const keypair = Keypair.fromSecretKey(secret);
        setCurrentIndex(currentIndex + 1);
        setPublicKeys([...publicKeys, keypair.publicKey]);
    }

    const [balance, setBalance] = useState('');

    async function getBalance (p) {
        console.log(p);
        const res = await axios.post("https://solana-mainnet.g.alchemy.com/v2/cF1alOQQ47lqaUIoTsSy0023M2OsQZeo", {
            "jsonrpc": "2.0",
            "id": 1,
            "method": "getBalance",
            "params": [p]
        })
        console.log(res.data)
        setBalance(res.data.result.value);
    }

    return <div className="text-center border-l-2 pl-5">
        <button className="border-2 p-2 mb-3 rounded-xl bg-amber-800" onClick={generateWallet}>
            Add SOL wallet
        </button>
        {publicKeys.map((p, index) => 
            <div className=" mb-2" key={index++}>
                Wallet {index+1} - <span className="underline underline-offset-[6px]">{p.toBase58()}</span> 
                <button className='ms-2 border-b-2 font-bold border-dotted p-2 rounded-2xl' onClick={getBalance.bind(this, p) }>Get balance</button>
            </div>
        )}
        {balance !== "" && <Balance balance={balance} />}
    </div>
}

function Balance({balance}) {
    return (
        <div className='text-white text-2xl'>Balance - {balance}</div>
    )
}