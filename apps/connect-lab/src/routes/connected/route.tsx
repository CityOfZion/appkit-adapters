import { InteractiveBackground } from "@/components/interactive-background";
import { RequestModal } from "@/components/request-modal";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { ChainHelper, type TSupportedChain } from "@/helpers/chain";
import { useConnection } from "@/hooks/use-connection";
import { EIP155Methods } from "@/components/methods/eip155-methods";
import { SolanaMethods } from "@/components/methods/solana-methods";
import { Neo3Methods } from "@/components/methods/neo3-methods";
import { StellarMethods } from "@/components/methods/stellar-methods";

import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { Unlink } from "lucide-react";
import { useTransition, Fragment, type ComponentType } from "react";
import { InfoBox } from "./-info-box";
import { NeoxMethods } from "@/components/methods/neox-methods";

export const Route = createFileRoute("/connected")({
  component: RouteComponent,
});

// It should be here because of fast refresh, otherwise it will cause an error when saving any methods component file
const methodsComponentByChain: Record<TSupportedChain, ComponentType> = {
  neo3: Neo3Methods,
  ethereum: EIP155Methods,
  arbitrum: EIP155Methods,
  base: EIP155Methods,
  // TODO: Fix that
  neox: NeoxMethods,
  polygon: EIP155Methods,
  solana: SolanaMethods,
  stellar: StellarMethods,
};

function RouteComponent() {
  const { connectionInfo, disconnect } = useConnection<true>();

  const [isDisconnecting, startDisconnect] = useTransition();

  if (connectionInfo.status !== "connected") {
    return <Navigate to="/" />;
  }

  const MethodComponent = methodsComponentByChain[connectionInfo.chain];
  const ChainIcon = ChainHelper.iconsByChain[connectionInfo.chain];
  const chainColor = ChainHelper.colorsByChain[connectionInfo.chain];

  const addressExplorerUrl =
    ChainHelper.addressExplorerUrlsByChain[connectionInfo.chain][
      connectionInfo.networkId
    ];
  const replacedAddressExplorerUrl = addressExplorerUrl?.replace(
    "{address}",
    connectionInfo.address,
  );

  return (
    <div className="min-h-screen w-screen relative px-4 py-10 flex justify-center overflow-auto">
      <InteractiveBackground />

      <RequestModal />

      <div className="flex flex-col gap-12 w-full max-w-7xl">
        <header className="flex flex-col gap-4">
          <div className="flex max-md:grid max-md:grid-rows-3 max-md:grid-cols-6 gap-2 w-full">
            <InfoBox className="items-center justify-center">
              <ChainIcon
                className="size-4 min-h-4 min-w-4"
                style={{ color: chainColor }}
              />
            </InfoBox>

            <InfoBox label="Blockchain" className="max-md:col-span-2">
              {connectionInfo.chain}
            </InfoBox>

            <InfoBox label="Network" className="max-md:col-span-3">
              {connectionInfo.networkId}
            </InfoBox>

            <Button
              className="grow min-w-0 max-md:col-span-6 h-full flex-col items-start px-4 py-2 gap-0"
              variant="outline"
              asChild
            >
              <Link
                to={replacedAddressExplorerUrl ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
              >
                <p className="capitalize text-xs font-medium text-slate-500 font-grotesk whitespace-nowrap">
                  Address
                </p>

                <p className="text-sm font-black text-primary font-sans capitalize truncate">
                  {connectionInfo.address}
                </p>
              </Link>
            </Button>

            <Button
              className="min-w-40 h-full rounded-xl max-md:col-span-6"
              variant="outline"
              onClick={() => startDisconnect(disconnect)}
            >
              {isDisconnecting ? (
                <Fragment>
                  <Spinner className="size-4" />
                  Disconnecting...
                </Fragment>
              ) : (
                <Fragment>
                  <Unlink className="size-4" />
                  Disconnect
                </Fragment>
              )}
            </Button>
          </div>

          {connectionInfo.walletInfo.name && connectionInfo.walletInfo.icon && (
            <div className="flex  items-center gap-4 px-4 py-3 rounded-2xl border border-white/5 backdrop-blur-xs">
              <img
                src={connectionInfo.walletInfo.icon}
                alt={connectionInfo.walletInfo.name}
                className="size-8 rounded-lg object-contain"
              />

              <p className="text-sm font-black text-white font-sans capitalize">
                {connectionInfo.walletInfo.name}
              </p>

              {connectionInfo.walletInfo.description && (
                <Fragment>
                  <div className="h-full w-px bg-white/5" />
                  <p className="text-sm text-slate-400 font-sans">
                    {connectionInfo.walletInfo.description}
                  </p>
                </Fragment>
              )}
            </div>
          )}
        </header>

        <main>
          <div className="flex items-center gap-4">
            <h2 className="text-base font-bold text-slate-400 font-sans">
              Test Methods
            </h2>

            <div className="grow h-px bg-slate-400/20" />
          </div>
        </main>

        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <MethodComponent />
        </ul>
      </div>
    </div>
  );
}
