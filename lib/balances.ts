import { PrivateKeyAccount, PublicClient } from "viem";
import { mainnetProvider } from "./providers"
import { Chain, parseAbi } from "viem";
import { useEffect, useState } from "react";
import { mainnet } from "viem/chains";


// Even though multicall3 provides a fn to get balance, viem stripped it off.
const multicallABI = parseAbi([
    'function getEthBalance(address addr) public view returns (uint256 balance)',
])

async function getMulticall3NativeBalances(wallets: PrivateKeyAccount[], chainInfo: Chain, publicClient: PublicClient) {
    if (!chainInfo?.contracts?.multicall3?.address) {
        throw "Multicall is not defined in chaininfo";
    }
    const multicallContract = {
        address: chainInfo.contracts.multicall3.address,
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

export function useEthereumBalances({ enabled, wallets }: { enabled: boolean, wallets: PrivateKeyAccount[] }) {
    const [balances, setBalances] = useState<bigint[]|undefined>();
    
    useEffect(
        () => {
            console.log("Fetching balances")
            if (!enabled) return;
            getMulticall3NativeBalances(wallets, mainnet, mainnetProvider)
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