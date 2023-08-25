import { useState } from "react";
import { Chain, PrivateKeyAccount } from "viem";
import { CollectedMetrics, IntegrationInfo, MetricsToDisplay } from "@/lib/types";
import { useEthereumBalances, useZkSyncEraBalances, useCustomBalances } from "@/lib/balances";
import WalletCard from "./walletcard";

import EigenLayer from "@/lib/integrations/eigenlayer";
import LibertasOmnibusZkSyncEra from "@/lib/integrations/libertasOmnibusZkSyncEra";
import { MuteIoZkSyncEthToUSDC } from "@/lib/integrations/muteio";

const defaultIntegrations = [EigenLayer, LibertasOmnibusZkSyncEra, MuteIoZkSyncEthToUSDC]

export default function PortfolioManager({ wallets }: { wallets: PrivateKeyAccount[] }) {
    const [integrations, setIntegrations] = useState<IntegrationInfo<any>[]>(defaultIntegrations);

    const allMetrics = integrations
        .flatMap(i => i.metrics)
        .reduce((unique: MetricsToDisplay[], next: MetricsToDisplay) => {
            if (unique.includes(next)) return unique;
            return [...unique, next];
        }, []);

    const ethereumBalances = useEthereumBalances({
        enabled: allMetrics.includes("MainnetBalance"),
        wallets,
    })
    const zkSyncEraBalances = useZkSyncEraBalances({
        enabled: allMetrics.includes("ZkSyncEthBalance"),
        wallets,
    })
    const customBalanesRequests = groupCustomBalances(allMetrics)
    const [nativeBalances, erc20Balances] = useCustomBalances({
        enabled: customBalanesRequests["erc20"].length > 0 || customBalanesRequests["native"].length > 0,
        request: customBalanesRequests,
        wallets
    })

    return (<>
        {wallets.map((w, index) => {
            const context: CollectedMetrics = {
                mainnetEther: ethereumBalances && ethereumBalances[index],
                zksyncEraEther: zkSyncEraBalances && zkSyncEraBalances[index],
                nativeBalances: nativeBalances[index],
                erc20Balances: erc20Balances[index],
            }
            return (<WalletCard wallet={w} key={w.address} selectedIntegrations={integrations} selectedMetrics={allMetrics} collectedMetrics={context} />);
        })}
    </>);
}

function groupCustomBalances(metrics: MetricsToDisplay[]): {"native": Chain[], "erc20": [Chain, `0x${string}`, string, number][]} {
    const result = {"native": ([] as Chain[]), "erc20": ([] as [Chain, `0x${string}`, string, number][])}
    type NonStringMetric = {"type": "native", "chain": Chain} | {"type": "erc20", "contract": `0x${string}`, "label": "string", "chain": Chain, "decimal": number};
    metrics.filter(m => typeof m === "object").forEach(m => {
        const metric = m as NonStringMetric;
        if (metric.type === "native") {
            if (!result["native"].find(c => c.id === metric.chain.id)) {
                result["native"].push(metric.chain);
            }
        } else if (metric.type === "erc20") {
            if (!result["erc20"].find(([c, a]) => c.id === metric.chain.id && a === metric.contract)) {
                result["erc20"].push([metric.chain, metric.contract, metric.label, metric.decimal])
            }
        }
    })
    return result
}