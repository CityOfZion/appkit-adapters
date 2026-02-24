import { createContext, useState, type Dispatch } from "react";

export type TRequestState =
  | {
      status: "idle";
    }
  | {
      status: "loading";
      method: string;
    }
  | {
      status: "error" | "success";
      method: string;
      data: any;
    };

type TRequestProviderState = {
  requestState: TRequestState;
  setRequestState: Dispatch<React.SetStateAction<TRequestState>>;
  request: (method: string, call: () => Promise<any>) => Promise<void>;
};

type RequestProviderProps = {
  children: React.ReactNode;
};

export const RequestProviderContext =
  createContext<TRequestProviderState | null>(null);

export function RequestProvider({ children }: RequestProviderProps) {
  const [requestState, setRequestState] = useState<TRequestState>({
    status: "idle",
  });

  async function request(method: string, call: () => Promise<any>) {
    try {
      setRequestState({ status: "loading", method });

      const response = await call();

      setRequestState({
        status: "success",
        method,
        data: response,
      });
    } catch (error) {
      console.error(error);
      setRequestState({
        status: "error",
        method,
        data: { error: error instanceof Error ? error.message : error },
      });
    }
  }

  return (
    <RequestProviderContext.Provider
      value={{ request, requestState, setRequestState }}
    >
      {children}
    </RequestProviderContext.Provider>
  );
}
