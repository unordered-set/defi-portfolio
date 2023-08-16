import { Chain, PrivateKeyAccount } from "viem";

export type MetricsToDisplay =
    "MainnetBalance"
    | "StEthBalance"
    | "ZkSyncEthBalance"
    | "BaseEthBalance"
    | "BaseDevNftBalance"
    | "EigenLayerStakedStEth"
    ;

export type CollectedMetrics = {
    mainnetEther: bigint | undefined,
    zksyncEraEther: bigint | undefined,
}

export type WidgetType =
    "Transfer"
    | "SimpleAction"
    ;

export type TxInfo = {
    hash: `0x${string}`,
    chain: Chain,
}

export type TxAdder = (txInfo: TxInfo) => void

export type UiContext = {
    txAdder: TxAdder,
}

export type HandlerFor<T extends WidgetType> =
    T extends "Transfer" ? (account: PrivateKeyAccount, amount: string, context: UiContext) => void
    : T extends "SimpleAction" ? (account: PrivateKeyAccount, context: UiContext) => void
    : never;

export type WidgetArgs<T extends WidgetType> =
    T extends "Transfer" ? [string, string]
    : T extends "SimpleAction" ? [string, string]
    : never;

export type IntegrationInfo<T extends WidgetType> = {
    name: string,
    metrics: MetricsToDisplay[],
    widget: WidgetType,
    widgetArgs: WidgetArgs<T>,
    handler: HandlerFor<T>,
};