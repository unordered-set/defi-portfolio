import { zksyncProvider } from "../providers";
import { IntegrationInfo, UiContext } from "../types"
import { PrivateKeyAccount, parseAbi, createWalletClient, http } from "viem"

const LibertasOmnibusZkSyncEra: IntegrationInfo<"SimpleAction"> = {
    name: "EigenLayer",
    metrics: ["ZkSyncEthBalance"],
    widget: "SimpleAction",
    widgetArgs: ["Libertas Omnibus", "ZkSync Era"],
    handler: libertasOmnibusZkSyncEraHandler,
}

async function libertasOmnibusZkSyncEraHandler(account: PrivateKeyAccount, context: UiContext) {
    const address = "0xD07180c423F9B8CF84012aA28cC174F3c433EE29";
    const abi = parseAbi([
        "function qrFreeMint(uint256 nonce, bytes memory signature) public",
        "function freeMint() public",
    ])
    const wc = createWalletClient({
        account,
        chain: zksyncProvider.chain,
        transport: http(),
    })

    const tx = await wc.writeContract({
        account,
        address,
        abi,
        functionName: 'freeMint',
    })
}

export default LibertasOmnibusZkSyncEra;