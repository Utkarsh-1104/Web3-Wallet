import { useState } from "react"
import { mnemonicToSeed } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import nacl from "tweetnacl"

export function SolanaWallet({ mnemonic }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [publicKeys, setPublicKeys] = useState([]);

    async function generateWallet() {
        const seed = await mnemonicToSeed(mnemonic);
        const path = `m/44'/501'/${currentIndex}'/0'`;
        const derivedSeed = derivePath(path, seed.toString("hex")).key;
        const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
        const keypair = Keypair.fromSecretKey(secret);
        setCurrentIndex(currentIndex + 1);
        setPublicKeys([...publicKeys, keypair.publicKey]);
    }

    return <div className="text-center border-l-2 pl-5">
        <button className="border-2 p-2 mb-3 rounded-xl bg-amber-800" onClick={generateWallet}>
            Add SOL wallet
        </button>
        {publicKeys.map((p, index) => 
            <div className=" mb-2" key={index++}>
            Wallet {index+1} - <span className="underline underline-offset-[6px]">{p.toBase58()}</span> 
        </div>)
        }
    </div>
}