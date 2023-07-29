"use client";

import Image from 'next/image'
import { useState } from 'react'

import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { privateKeyToAccount, PrivateKeyAccount } from 'viem/accounts'

function WalletOverview({ wallet }: { wallet: PrivateKeyAccount }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{`${wallet.address.substring(0, 6)}..${wallet.address.substring(wallet.address.length - 4)}`}</CardTitle>
        <CardDescription>{wallet.address}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Balances:</p>
      </CardContent>
    </Card>
  )
}

function ActionName({name}: {name: string}) {
  return (<div className="text-lg font-semibold mt-8">{name}</div>)
}

function WalletAction({wallet}: {wallet: PrivateKeyAccount}) {
  return (
    <div className="flex flex-col">
      <span>{wallet.address}</span>
      <Button>Go</Button>
    </div>
  )
}

function DefiPortfolio({ wallets }: { wallets: PrivateKeyAccount[] }) {
  return (
    <>
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        DeFi Portfolio
      </h1>
      <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
        Wallet View
      </h2>
      <div className="flex flex-wrap gap-1.5 pt-2">
        {wallets.map(w => (<WalletOverview wallet={w} key={w.address}></WalletOverview>))}
      </div>
      <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
        Actions View
      </h2>
      <ActionName name="Orbiter" />
      <div className="flex flex-wrap gap-1.5 pt-2">
        {wallets.map(w => (<WalletAction wallet={w} key={`action-o-z-a-${w.address}`}></WalletAction>))}
      </div>
      <ActionName name="StarkNet" />
      <div className="flex flex-wrap gap-1.5 pt-2">
        {wallets.map(w => (<WalletAction wallet={w} key={`action-o-z-a-${w.address}`}></WalletAction>))}
      </div>
    </>
  )
}

// Sample key: d7403eb69ebef57aa9be59921efe29880e1e6cd300a8bbfc9323e0e6cfd4d9a2
type SetWalletsHandler = (wallets: PrivateKeyAccount[]) => void;

function WalletImporter({ setWallets }: { setWallets: SetWalletsHandler }) {
  const [keys, setKeys] = useState("")
  const getKeys = () => {
    return (keys.match(/[0-9A-Fa-f]{64}/g) || []).map(k => privateKeyToAccount(`0x${k}`));
  };

  return (
    <div className="grid w-full gap-1.5">
      <Label htmlFor="pk-input">Please, enter your private keys:</Label>
      <Textarea placeholder="0x0123456789abcdef...." id="pk-input" onChange={e => setKeys(e.target.value)} />
      <Button style={{ width: 'fit-content' }} onClick={() => setWallets(getKeys())}>OK</Button>
    </div>
  )
}

export default function Home() {
  const [wallets, setWallets] = useState<PrivateKeyAccount[]>([]);

  return (
    <main className="flex min-h-screen flex-col p-4">
      {wallets.length > 0 ? (<DefiPortfolio wallets={wallets} />) : (<WalletImporter setWallets={setWallets} />)}
    </main>
  )
}

function Home_DEFAULT() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Get started by editing&nbsp;
          <code className="font-mono font-bold">app/page.tsx</code>
        </p>
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
          <a
            className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
            href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            By{' '}
            <Image
              src="/vercel.svg"
              alt="Vercel Logo"
              className="dark:invert"
              width={100}
              height={24}
              priority
            />
          </a>
        </div>
      </div>

      <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px] z-[-1]">
        <Image
          className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
          src="/next.svg"
          alt="Next.js Logo"
          width={180}
          height={37}
          priority
        />
      </div>

      <div className="mb-32 grid text-center lg:mb-0 lg:grid-cols-4 lg:text-left">
        <a
          href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Docs{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Find in-depth information about Next.js features and API.
          </p>
        </a>

        <a
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Learn{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Learn about Next.js in an interactive course with&nbsp;quizzes!
          </p>
        </a>

        <a
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Templates{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Explore the Next.js 13 playground.
          </p>
        </a>

        <a
          href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Deploy{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Instantly deploy your Next.js site to a shareable URL with Vercel.
          </p>
        </a>
      </div>
    </main>
  )
}
