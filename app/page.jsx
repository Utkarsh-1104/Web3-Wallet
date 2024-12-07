"use client";
import { useState } from "react";
import { generateMnemonic } from "bip39";
import EthWallet from "./components/EthWallet";
import { SolanaWallet } from "./components/SolanaWallet";

export default function Home() {
  const [mnemonics, setMnemonics] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(mnemonics);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 3000);
  }

  function generateSeedPhrase() {
    const mnemonic = generateMnemonic();
    setMnemonics(mnemonic);
  }
  console.log(mnemonics);
  const seeds = mnemonics.split(" ");
  console.log(seeds);
  const box = <div className="flex gap-6">
  {mnemonics && <EthWallet mnemonic={mnemonics} />}
  <div className="h-40 w-[1px] bg-white "></div>
  {mnemonics && <SolanaWallet mnemonic={mnemonics} />}
  
</div>
  return (
    <div className="bg-black min-h-screen text-white flex flex-col justify-center items-center gap-7 py-10 ">
      <h1 className="text-5xl font-[Sniglet]">Create a Wallet in 2 Clicks</h1>
      <div className="text-center">
        <button className="p-5 border-2 text-xl rounded-2xl hover:bg-orange-800 " onClick={generateSeedPhrase} >Generate Seed Phrase</button>
        { seeds.length === 12 && 
          <div className="p-5 mt-5 border-8 text-xl border-double border-neutral-200 " >
            <div className="grid grid-cols-4 gap-3">
              { 
                seeds.map((seed, index) => (
                  <div key={index} className="p-2 border-2 border-dashed ">{seed}</div>
                ))
              }
            </div>
            {
              seeds.length === 12 && <button onClick={copy} className="mt-3 py-1 px-4 text-base border-2 bg-[#424242] ">{isCopied ? "Copied" : "Copy"}</button>
            }
          </div>
        }
      </div>

      {mnemonics && 
        <div className="flex gap-5">
          <EthWallet mnemonic={mnemonics} />
          <SolanaWallet mnemonic={mnemonics} />
        </div>
      }
    </div>
  );
}
