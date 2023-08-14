import { createPublicClient, http } from "viem";
import { mainnet } from "viem/chains";


export const MAINNET_OVERRIDE_URL = 'https://rpc.tenderly.co/fork/760fa2ee-b81f-4f76-8fc2-2bc91f58ca88'


export const mainnetProvider = createPublicClient({
    chain: mainnet,
    transport: http(MAINNET_OVERRIDE_URL)
})