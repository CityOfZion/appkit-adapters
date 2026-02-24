import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { useRequest } from "@/hooks/use-request";
import { Code, Copy } from "lucide-react";

export function RequestModal() {
  const { requestState, setRequestState } = useRequest();

  return (
    <Dialog.Root
      open={requestState.status !== "idle"}
      onOpenChange={() => setRequestState({ status: "idle" })}
    >
      {requestState.status !== "idle" && (
        <Dialog.Content onInteractOutside={(event) => event.preventDefault()}>
          <Dialog.Header className="flex-row w-full items-center">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Code className="size-4 text-blue-400" />
            </div>

            <div className="grow flex flex-col justify-center">
              <Dialog.Title>RPC Execution</Dialog.Title>

              <p className="text-[10px] text-slate-500 font-sans font-bold uppercase tracking-wider">
                {requestState.method}
              </p>
            </div>

            <Dialog.Close />
          </Dialog.Header>

          {requestState.status === "loading" ? (
            <Dialog.Body className="items-center text-center">
              <div className="flex flex-col gap-4 items-center animate-pulse">
                <Spinner />
                <p className="text-white font-bold text-lg  font-brand">
                  Awaiting Confirmation
                </p>
                <p className="text-slate-500 text-sm leading-relaxed max-w-sm">
                  Please check your wallet for the incoming{" "}
                  {requestState.method} request.
                </p>
              </div>
            </Dialog.Body>
          ) : (
            <Dialog.Body className="items-center text-center py-5">
              <div
                data-status={requestState.status}
                className="relative bg-black text-left data-[status=error]:bg-red-950/5 w-full backdrop-blur-lg rounded-2xl p-8 border border-emerald-500/20 text-emerald-400/90 data-[status=error]:border-red-500/20 data-[status=error]:text-red-400/90 overflow-y-scroll min-h-65 max-h-65"
              >
                <Button
                  className="absolute top-4 right-4"
                  variant="ghost"
                  size="icon-sm"
                >
                  <Copy className="size-4" />
                </Button>

                <pre className="font-mono w-full h-full font-medium text-sm leading-relaxed whitespace-pre-wrap wrap-break-word mt-4">
                  {JSON.stringify(requestState.data, null, 2)}
                </pre>
              </div>

              <Button
                className="w-full"
                variant="outline"
                onClick={() => setRequestState({ status: "idle" })}
              >
                Close
              </Button>
            </Dialog.Body>
          )}
        </Dialog.Content>
      )}
    </Dialog.Root>
  );
}
