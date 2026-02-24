import { useContext } from "react";
import { ConnectionProviderContext } from "@/contexts/connection";

export function useConnection<Connected extends boolean = false>() {
  const context = useContext(ConnectionProviderContext);

  if (context === null)
    throw new Error("useConnection must be used within a ConnectionProvider");

  return {
    ...context,
    connectionInfo: context.connectionInfo as Connected extends true
      ? Exclude<
          typeof context.connectionInfo,
          { status: "not_connected" | "connecting" }
        >
      : typeof context.connectionInfo,
  };
}
