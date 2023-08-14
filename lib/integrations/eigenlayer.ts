import { PrivateKeyAccount, createWalletClient, http, parseAbi, parseEther } from "viem";
import { MAINNET_OVERRIDE_URL, mainnetProvider } from "../providers";
import { IntegrationInfo, UiContext } from "../types"

const EigenLayer: IntegrationInfo<"Transfer"> = {
    name: "EigenLayer",
    metrics: ["MainnetBalance", "EigenLayerStakedStEth"],
    widget: "Transfer",
    widgetArgs: ["EigenLayer", "stETH"],
    handler: eigenLayerHandler,
}

async function eigenLayerHandler(account: PrivateKeyAccount, amount: string, context: UiContext) {
    const mainnetNonce = await mainnetProvider.getTransactionCount({
        address: account.address
    })

    const wc = createWalletClient({
        account,
        chain: mainnetProvider.chain,
        transport: http(MAINNET_OVERRIDE_URL),
    })

    const stETH = "0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84";
    const eigenLayerStrategyManager = "0x858646372CC42E1A627fcE94aa7A7033e7CF075A";

    const lidoAbi = parseAbi([
        'function submit(address _referral) external payable returns (uint256)',
        'function approve(address _spender, uint256 _amount) external returns (bool)',
        'function balanceOf(address owner) external view returns (uint256)',
    ])
    const eigenLayerAbi = parseAbi([
        'function depositIntoStrategy(address strategy, address token, uint256 amount) external',
    ])

    const { request: mintStEthRequest } = await mainnetProvider.simulateContract({
        account,
        address: stETH,
        abi: lidoAbi,
        functionName: 'submit',
        args: [account.address],
        nonce: mainnetNonce,

        value: parseEther(amount),
    })

    const mintLidoTx = await wc.writeContract(mintStEthRequest)
    const mintLidoEffects = await mainnetProvider.waitForTransactionReceipt({
        hash: mintLidoTx
    })

    const transferLogs = mintLidoEffects.logs.filter(log => log.topics[0] === "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef");
    if (transferLogs.length !== 1) {
        console.log("Unexpected logs in tx", mintLidoTx)
    }

    const stLidoAmount = BigInt(transferLogs[0].data)

    const { request: approveStEthRequest } = await mainnetProvider.simulateContract({
        account,
        address: stETH,
        abi: lidoAbi,
        functionName: 'approve',
        args: [eigenLayerStrategyManager, stLidoAmount],
        nonce: mainnetNonce + 1,
    })
    const approveLidoTx = await wc.writeContract(approveStEthRequest)

    const { request: depositToStrategyRequest } = await mainnetProvider.simulateContract({
        account,
        address: eigenLayerStrategyManager,
        abi: eigenLayerAbi,
        functionName: 'depositIntoStrategy',
        args: ["0x93c4b944D05dfe6df7645A86cd2206016c51564D", stETH, stLidoAmount],
        nonce: mainnetNonce + 2,
    })
    const depositTx = await wc.writeContract(depositToStrategyRequest)
}

export default EigenLayer;