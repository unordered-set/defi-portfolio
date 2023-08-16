import { createPublicClient, http } from "viem";
import { mainnet, zkSync } from "viem/chains";


export const MAINNET_OVERRIDE_URL = undefined;

export const mainnetProvider = createPublicClient({
    chain: mainnet,
    transport: http(MAINNET_OVERRIDE_URL)
})

export const zksyncProvider = createPublicClient({
    chain: zkSync,
    transport: http()
})