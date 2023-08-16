import { useState } from "react";
import { PrivateKeyAccount } from "viem";
import { CollectedMetrics, IntegrationInfo, MetricsToDisplay } from "@/lib/types";
import { useEthereumBalances, useZkSyncEraBalances } from "@/lib/balances";
import WalletCard from "./walletcard";

import EigenLayer from "@/lib/integrations/eigenlayer";
import LibertasOmnibusZkSyncEra from "@/lib/integrations/libertasOmnibusZkSyncEra";

const defaultIntegrations = [EigenLayer, LibertasOmnibusZkSyncEra]

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

    return (<>
        {wallets.map((w, index) => {
            const context: CollectedMetrics = {
                mainnetEther: ethereumBalances && ethereumBalances[index],
                zksyncEraEther: zkSyncEraBalances && zkSyncEraBalances[index],
            }
            return (<WalletCard wallet={w} key={w.address} selectedIntegrations={integrations} selectedMetrics={allMetrics} collectedMetrics={context} />);
        })}
    </>);
}