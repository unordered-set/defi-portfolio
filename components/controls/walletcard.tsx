import { CollectedMetrics, IntegrationInfo, MetricsToDisplay, TxInfo, UiContext } from "@/lib/types";
import { PrivateKeyAccount } from "viem";
import { getEtherWithPrecison } from "@/lib/utils";
import TransferAction from "./transferaction";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { useState } from "react";

function BalanceMetrics({ name, value }: { name: string, value: bigint | undefined }) {
    return (<>
        <div>{name}</div>
        <div>
            {value === undefined ? "..." :
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>{getEtherWithPrecison(value)}</TooltipTrigger>
                        <TooltipContent>
                            <p>RAW: {value.toString()}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>}
        </div>
    </>)
}

function renderIntegration(integration: IntegrationInfo<any>, index: number, wallet: PrivateKeyAccount, context: UiContext) {
    if (integration.widget === "Transfer") {
        const ti = integration as IntegrationInfo<"Transfer">;
        return (
            <TransferAction name={ti.widgetArgs[0]}
                subname={ti.widgetArgs[1]}
                action={v => ti.handler(wallet, v, context)}
            />)
    }
    return (<div key={index}>{integration.name} is not supported yet</div>)
}

export default function WalletCard(
    { wallet, selectedIntegrations, selectedMetrics, collectedMetrics }:
        {
            wallet: PrivateKeyAccount,
            selectedIntegrations: IntegrationInfo<any>[],
            selectedMetrics: MetricsToDisplay[],
            collectedMetrics: CollectedMetrics
        }) {

    const [lastTransactions, setLastTransactions] = useState<TxInfo[]>([]);

    const context: UiContext = {
        txAdder: (txInfo: TxInfo) => setLastTransactions([txInfo, ...lastTransactions]),
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>{`${wallet.address.substring(0, 6)}..${wallet.address.substring(wallet.address.length - 4)}`}</CardTitle>
                <CardDescription>{wallet.address}</CardDescription>
            </CardHeader>
            <CardContent>
                <h5 className="text-base font-semibold pt-4">Balances</h5>
                <div className="grid gap-2 grid-cols-2">
                    {selectedMetrics.includes("MainnetBalance") &&
                        (<BalanceMetrics name="Mainnet ETH" value={collectedMetrics.mainnetEther} />)}
                </div>

                <h5 className="text-base font-semibold pt-4">Actions</h5>
                <div className="flex flex-col gap-2">
                    {selectedIntegrations.map((integration, index) => renderIntegration(integration, index, wallet, context))}
                </div>
            </CardContent>
        </Card>
    )
}