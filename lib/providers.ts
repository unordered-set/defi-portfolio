import { createPublicClient, http } from "viem";
import { mainnet } from "viem/chains";


export const MAINNET_OVERRIDE_URL = undefined;


export const mainnetProvider = createPublicClient({
    chain: mainnet,
    transport: http(MAINNET_OVERRIDE_URL)
})