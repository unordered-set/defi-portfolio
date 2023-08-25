import { PrivateKeyAccount, PublicClient } from "viem";
import { mainnetProvider, providerByChain, zksyncProvider } from "./providers"
import { Chain, parseAbi } from "viem";
import { useEffect, useState } from "react";
import { zkSync } from "viem/chains";
import { MetricsToDisplay } from "./types";


// Even though multicall3 provides a fn to get balance, viem stripped it off.
const multicallABI = parseAbi([
    'function getEthBalance(address addr) public view returns (uint256 balance)',
])
const erc20abi = parseAbi([
    'function balanceOf(address addr) public view returns (uint256 balance)',
])

async function getMulticall3NativeBalances(wallets: PrivateKeyAccount[], publicClient: PublicClient) {
    if (!publicClient.chain?.contracts?.multicall3?.address) {
        throw "Multicall is not defined in chaininfo";
    }
    const multicallContract = {
        address: publicClient.chain.contracts.multicall3.address,
        abi: multicallABI,
    }
    return await publicClient.multicall({
        contracts: wallets.map(w => ({
            ...multicallContract,
            functionName: 'getEthBalance',
            args: [w.address]
        }))
    })
}

async function getMulticall3Erc20Balances(wallets: PrivateKeyAccount[], contractAddress: `0x${string}`, publicClient: PublicClient) {
    if (!publicClient.chain?.contracts?.multicall3?.address) {
        throw "Multicall is not defined in chaininfo";
    }
    const erc20Contract = {
        address: contractAddress,
        abi: erc20abi,
    }
    return await publicClient.multicall({
        contracts: wallets.map(w => ({
            ...erc20Contract,
            functionName: 'balanceOf',
            args: [w.address]
        }))
    })
}

export function useGenericBalanceChecker({ enabled, wallets, provider }: { enabled: boolean, wallets: PrivateKeyAccount[], provider: PublicClient }) {
    const [balances, setBalances] = useState<bigint[] | undefined>();

    useEffect(
        () => {
            console.log("Fetching balances")
            if (!enabled) return;
            getMulticall3NativeBalances(wallets, provider)
                .then(result => {
                    console.log("Got balances", result)
                    const balances: bigint[] = [];
                    result.forEach((rec, index) => {
                        if (rec.status === "success") {
                            balances.push(rec.result);
                        } else {
                            console.log(`Error on fetching status for ${wallets[index].address}: ${rec.error}`);
                            balances.push(0n);
                        }
                    });
                    setBalances(balances);
                })
        },
        [enabled, ...wallets]
    );

    return balances;
}


export function useEthereumBalances({ enabled, wallets }: { enabled: boolean, wallets: PrivateKeyAccount[] }) {
    return useGenericBalanceChecker({ enabled, wallets, provider: mainnetProvider })
}

export function useZkSyncEraBalances({ enabled, wallets }: { enabled: boolean, wallets: PrivateKeyAccount[] }) {
    return useGenericBalanceChecker({ enabled, wallets, provider: zksyncProvider })
}

export const ZkSyncUSDC: MetricsToDisplay = { type: "erc20", chain: zkSync, contract: "0x3355df6d4c9c3035724fd0e3914de96a5a83aaf4", label: "USDC" };

export function useCustomBalances({ enabled, wallets, request }: {
    enabled: boolean,
    wallets: PrivateKeyAccount[],
    request: { "native": Chain[], "erc20": [Chain, `0x${string}`, string][] }
}) : [
    [Chain, bigint][][], [Chain, `0x${string}`, string, bigint][][]
] {

    const [nativeBalances, setNativeBalances] = useState<[Chain, bigint][][]>(Array(wallets.length).fill([]));
    const [erc20Balances, setErc20Balances] = useState<[Chain, `0x${string}`, string, bigint][][]>(Array(wallets.length).fill([]));

    const requestKey = `${request["native"].map(c => c.id).join("+")}::${request["erc20"].map(([ch, co]) => `${ch.id}_${co}`).join("+")}`;

    useEffect(() => {
        console.log("Fetching custom balances", request)
        if (!enabled) return;
        for (const chainToGetNativeBalance of request["native"]) {
            const provider = providerByChain(chainToGetNativeBalance)
            getMulticall3NativeBalances(wallets, provider)
                .then(result => {
                    console.log("Got native balances for", chainToGetNativeBalance.name, result)
                    const newNativeBalances = [] as [Chain, bigint][][];
                    result.forEach((rec, index) => {
                        if (rec.status === "success") {
                            newNativeBalances.push([...nativeBalances[index], [chainToGetNativeBalance, rec.result]]);
                        } else {
                            console.log(`Error on fetching status for ${wallets[index].address}: ${rec.error}`);
                            newNativeBalances.push([...nativeBalances[index], [chainToGetNativeBalance, 0n]]);
                        }
                    });
                    setNativeBalances(newNativeBalances)
                })
        }
        for (const [chain, contract, label] of request["erc20"]) {
            const provider = providerByChain(chain)
            getMulticall3Erc20Balances(wallets, contract, provider)
                .then(result => {
                    console.log("Got ERC20 balances for", chain.name, contract, result)
                    const newErc20Balances = [] as [Chain, `0x${string}`, string, bigint][][];
                    result.forEach((rec, index) => {
                        if (rec.status === "success") {
                            newErc20Balances.push([...erc20Balances[index], [chain, contract, label, rec.result]]);
                        } else {
                            console.log(`Error on fetching status for ${wallets[index].address}: ${rec.error}`);
                            newErc20Balances.push([...erc20Balances[index], [chain, contract, label, 0n]]);
                        }
                    });
                    setErc20Balances(newErc20Balances)
                })
        }
    }, [enabled, ...wallets, requestKey]);

    return [nativeBalances, erc20Balances]
}