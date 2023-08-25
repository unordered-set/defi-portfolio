import { createPublicClient, http } from "viem";
import { Chain, mainnet, zkSync } from "viem/chains";


export const MAINNET_OVERRIDE_URL = undefined;

export const mainnetProvider = createPublicClient({
    chain: mainnet,
    transport: http(MAINNET_OVERRIDE_URL)
})

export const zksyncProvider = createPublicClient({
    chain: zkSync,
    transport: http()
})

export function providerByChain(chain: Chain) {
    if (chain.id === mainnet.id) return mainnetProvider;
    if (chain.id === zkSync.id) return zksyncProvider;
    throw new Error(`Requested provider for unsupported chain ${chain.name}`)
}