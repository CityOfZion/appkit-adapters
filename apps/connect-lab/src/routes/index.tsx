import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { InteractiveBackground } from "@/components/interactive-background";
import { ChainHelper } from "@/helpers/chain";
import { useConnection } from "@/hooks/use-connection";
import { AnimatedAppLogo } from "@/components/app-logo";
import { useEffect } from "react";
import { UtilsHelper } from "@/helpers/utils";
import { RefreshCw } from "lucide-react";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  const { connect, connectionInfo } = useConnection();
  const navigate = useNavigate();

  useEffect(() => {
    if (connectionInfo.status !== "connected") return;
    UtilsHelper.sleep(1500).then(() => {
      navigate({ to: "/connected" });
    });
  }, [connectionInfo.status]);

  return (
    <div className="flex items-center h-screen w-scree flex-col relative px-10">
      <InteractiveBackground />

      <AnimatedAppLogo className="mt-36" />

      <h1 className="text-7xl max-sm:text-4xl font-bold -tracking-widest font-grotesk mt-6 animate-in fade-in slide-in-from-bottom-20 duration-500">
        Connect<span className="text-primary font-black">Lab</span>
      </h1>

      <h2 className="mt-4 max-sm:text-base text-xl gap-2 flex text-center items-center font-bold max-w-md animate-in fade-in slide-in-from-bottom-20 duration-500">
        A testing environment for your WalletConnect V2 integrations.
      </h2>

      {connectionInfo.status !== "not_connected" ? (
        <div className="flex mt-12 flex-col items-center animate-in fade-in slide-in-from-bottom-20 duration-500">
          <RefreshCw className="text-blue-500 size-8 animate-spin " />

          {connectionInfo.status === "connecting" ? (
            <div className="flex flex-col mt-4 items-center">
              <span className="text-lg font-bold text-white font-grotesk">
                Reconnecting
              </span>

              <span className="text-sm text-slate-400 font-medium text-center">
                Checking previous sessions...
              </span>
            </div>
          ) : (
            <div className="flex flex-col mt-4 items-center animate-in fade-in slide-in-from-bottom-20 duration-500">
              <span className="text-lg font-bold text-primary font-grotesk">
                Connected
              </span>

              <span className="text-sm text-slate-400 font-medium text-center">
                Redirecting to your connected dapp...
              </span>
            </div>
          )}
        </div>
      ) : (
        <ul className="flex mt-12 flex-wrap justify-center gap-3 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-20 duration-500">
          {ChainHelper.supportedChains.map((chain) => {
            const Icon = ChainHelper.iconsByChain[chain];
            const color = ChainHelper.colorsByChain[chain];

            return (
              <li key={chain}>
                <button
                  className="group flex items-center gap-3 px-5 py-3 rounded-2xl border border-white/5 cursor-pointer shadow-lg relative overflow-hidden duration-300 transition-all hover:scale-105"
                  onClick={() => connect(chain)}
                >
                  <div
                    className="w-full h-full absolute top-0 left-0 opacity-0 group-hover:opacity-100 transition-all duration-300"
                    style={{ backgroundColor: color }}
                  />

                  <Icon className="size-6 relative" />

                  <span className="text-sm font-bold text-white uppercase tracking-widest font-brand relative">
                    {chain}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
