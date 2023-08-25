// 0x8b791913eb07c32779a16750e3868aa8495f5964
// 0x51cbf10f
// 0x00   000000000000000000000000000000000000000000000000000000000068db35
// 0x20   00000000000000000000000000000000000000000000000000000000000000a0
// 0x40   00000000000000000000000056802035cc5ccbd3cff74c7d7009755ea1d22d68
// 0x60   0000000000000000000000000000000000000000000000000000000064e84e4f
// 0x80   0000000000000000000000000000000000000000000000000000000000000100
// 0xa0   0000000000000000000000000000000000000000000000000000000000000002
// 0xc0   0000000000000000000000005aea5775959fbc2557cc8789bc1bf90a239d9a91
// 0xe0   0000000000000000000000003355df6d4c9c3035724fd0e3914de96a5a83aaf4
// 0x00   0000000000000000000000000000000000000000000000000000000000000002
// 0x100  0000000000000000000000000000000000000000000000000000000000000001
// 0x120  0000000000000000000000000000000000000000000000000000000000000000

import { zksyncProvider } from "../providers";
import { IntegrationInfo, UiContext } from "../types"
import { PrivateKeyAccount, parseAbi, createWalletClient, http, parseEther } from "viem"
import { ZkSyncUSDC } from "../balances";
import { getTimestampOffset } from "../utils";

const address = "0x8b791913eb07c32779a16750e3868aa8495f5964";

export const MuteIoZkSyncEthToUSDC: IntegrationInfo<"Transfer"> = {
    name: "Mute.io",
    metrics: ["ZkSyncEthBalance", ZkSyncUSDC],
    widget: "Transfer",
    widgetArgs: ["ZkSync ETH -> USDC", "mute.io"],
    handler: muteIoZkSyncEthToUSDC,
}



async function muteIoZkSyncEthToUSDC(account: PrivateKeyAccount, amount: string, context: UiContext) {
    const abi = parseAbi([
        `function swapExactETHForTokensSupportingFeeOnTransferTokens(uint amountOutMin, address[] calldata path, address to, uint deadline, bool[] calldata stable) external payable`
    ])

    const wc = createWalletClient({
        account,
        chain: zksyncProvider.chain,
        transport: http(zksyncProvider.transport.url)
    })

    const amountOutMin = 0n;  // TODO: estimate using some exchanges APIs in order
                              //       not to make things inefficient.
    const { request } = await zksyncProvider.simulateContract({
        account,
        address,
        abi,
        functionName: 'swapExactETHForTokensSupportingFeeOnTransferTokens',
        args: [
            amountOutMin,
            [
                "0x5aea5775959fbc2557cc8789bc1bf90a239d9a91",
                "0x3355df6d4c9c3035724fd0e3914de96a5a83aaf4",
            ],
            account.address,
            getTimestampOffset(120),
            [
                true,
                false,
            ]
        ],

        value: parseEther(amount),
    })

    await wc.writeContract(request)
}