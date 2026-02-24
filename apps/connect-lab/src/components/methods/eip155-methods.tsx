import { MethodCard } from "@/components/method-card";
import { parseEther, parseUnits, type Hex } from "viem";
import {
  call,
  readContract,
  sendTransaction,
  signMessage,
  signTransaction,
  signTypedData,
  writeContract,
} from "@wagmi/core";
import { Fragment } from "react";
import { sepolia } from "@reown/appkit/networks";
import { useRequest } from "@/hooks/use-request";
import { useConnection } from "@/hooks/use-connection";
import { AppKitHelper } from "@/helpers/appkit";

const usdcToken = {
  address: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238" as Hex,
  abi: [
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "spender",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "value",
          type: "uint256",
        },
      ],
      name: "Approval",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint8",
          name: "version",
          type: "uint8",
        },
      ],
      name: "Initialized",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "bytes32",
          name: "role",
          type: "bytes32",
        },
        {
          indexed: true,
          internalType: "bytes32",
          name: "previousAdminRole",
          type: "bytes32",
        },
        {
          indexed: true,
          internalType: "bytes32",
          name: "newAdminRole",
          type: "bytes32",
        },
      ],
      name: "RoleAdminChanged",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "bytes32",
          name: "role",
          type: "bytes32",
        },
        {
          indexed: true,
          internalType: "address",
          name: "account",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "sender",
          type: "address",
        },
      ],
      name: "RoleGranted",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "bytes32",
          name: "role",
          type: "bytes32",
        },
        {
          indexed: true,
          internalType: "address",
          name: "account",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "sender",
          type: "address",
        },
      ],
      name: "RoleRevoked",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "from",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "value",
          type: "uint256",
        },
      ],
      name: "Transfer",
      type: "event",
    },
    {
      inputs: [],
      name: "DEFAULT_ADMIN_ROLE",
      outputs: [
        {
          internalType: "bytes32",
          name: "",
          type: "bytes32",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "name_",
          type: "string",
        },
        {
          internalType: "string",
          name: "symbol_",
          type: "string",
        },
      ],
      name: "ERC20_initialize",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "MinterRole",
      outputs: [
        {
          internalType: "bytes32",
          name: "",
          type: "bytes32",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          internalType: "address",
          name: "spender",
          type: "address",
        },
      ],
      name: "allowance",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "spender",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
      ],
      name: "approve",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "account",
          type: "address",
        },
      ],
      name: "balanceOf",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "decimals",
      outputs: [
        {
          internalType: "uint8",
          name: "",
          type: "uint8",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "spender",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "subtractedValue",
          type: "uint256",
        },
      ],
      name: "decreaseAllowance",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "role",
          type: "bytes32",
        },
      ],
      name: "getRoleAdmin",
      outputs: [
        {
          internalType: "bytes32",
          name: "",
          type: "bytes32",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "role",
          type: "bytes32",
        },
        {
          internalType: "address",
          name: "account",
          type: "address",
        },
      ],
      name: "grantRole",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "role",
          type: "bytes32",
        },
        {
          internalType: "address",
          name: "account",
          type: "address",
        },
      ],
      name: "hasRole",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "spender",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "addedValue",
          type: "uint256",
        },
      ],
      name: "increaseAllowance",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "name_",
          type: "string",
        },
        {
          internalType: "string",
          name: "symbol_",
          type: "string",
        },
      ],
      name: "initialize",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "account",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
      ],
      name: "mint",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "name",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "role",
          type: "bytes32",
        },
        {
          internalType: "address",
          name: "account",
          type: "address",
        },
      ],
      name: "renounceRole",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "role",
          type: "bytes32",
        },
        {
          internalType: "address",
          name: "account",
          type: "address",
        },
      ],
      name: "revokeRole",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes4",
          name: "interfaceId",
          type: "bytes4",
        },
      ],
      name: "supportsInterface",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "symbol",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "totalSupply",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
      ],
      name: "transfer",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "from",
          type: "address",
        },
        {
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
      ],
      name: "transferFrom",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
  ] as const,
};

export function EIP155Methods() {
  const { request } = useRequest();
  const {
    connectionInfo: { address, networkId },
  } = useConnection<true>();

  function sendSendTransaction() {
    request("eth_sendTransaction", async () => {
      await sendTransaction(AppKitHelper.eip155Adapter.wagmiConfig, {
        to: address as Hex,
        value: parseEther("0.000001"),
      });
    });
  }

  function sendSendContractTransaction() {
    request("eth_sendTransaction", async () => {
      const balance = await readContract(
        AppKitHelper.eip155Adapter.wagmiConfig,
        {
          abi: usdcToken.abi,
          address: usdcToken.address,
          functionName: "balanceOf",
          args: [address as Hex],
        },
      );

      if (balance <= 0) {
        throw new Error(
          "You need to have some USDC in your account to send a transaction using the Contract instance. Faucet here: https://faucet.circle.com/",
        );
      }

      const decimals = await readContract(
        AppKitHelper.eip155Adapter.wagmiConfig,
        {
          abi: usdcToken.abi,
          address: usdcToken.address,
          functionName: "decimals",
        },
      );

      return await writeContract(AppKitHelper.eip155Adapter.wagmiConfig, {
        abi: usdcToken.abi,
        address: usdcToken.address,
        functionName: "transfer",
        args: [address as Hex, parseUnits("1", decimals)],
      });
    });
  }

  function sendCall() {
    request(
      "eth_call",
      async () =>
        await call(AppKitHelper.eip155Adapter.wagmiConfig, {
          to: address as Hex,
          value: parseEther("0.000001"),
        }),
    );
  }

  function sendSignTransaction() {
    request(
      "eth_signTransaction",
      async () =>
        await signTransaction(AppKitHelper.eip155Adapter.wagmiConfig, {
          to: address as Hex,
          value: parseEther("0.000001"),
        }),
    );
  }

  function sendSignTypedData() {
    request(
      "eth_signTypedData",
      async () =>
        await signTypedData(AppKitHelper.eip155Adapter.wagmiConfig, {
          domain: {
            name: "Ether Mail",
            version: "1",
            chainId: BigInt(networkId),
            verifyingContract: "0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC",
          },
          types: {
            EIP712Domain: [
              { name: "name", type: "string" },
              { name: "version", type: "string" },
              { name: "chainId", type: "uint256" },
              { name: "verifyingContract", type: "address" },
            ],
            Person: [
              { name: "name", type: "string" },
              { name: "wallet", type: "address" },
            ],
            Mail: [
              { name: "from", type: "Person" },
              { name: "to", type: "Person" },
              { name: "contents", type: "string" },
            ],
          },
          primaryType: "Mail",
          message: {
            from: {
              name: "Cow",
              wallet: "0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826",
            },
            to: {
              name: "Bob",
              wallet: "0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB",
            },
            contents: "Hello, Bob!",
          },
        }),
    );
  }

  function sendSignMessage() {
    request(
      "signMessage",
      async () =>
        await signMessage(AppKitHelper.eip155Adapter.wagmiConfig, {
          message: `Hello, ${address}`,
        }),
    );
  }

  return (
    <Fragment>
      <li className="h-full">
        <MethodCard
          name="eth_sendTransaction"
          description="Sends a transaction to the network. This method will broadcast the transaction and return the transaction hash."
          docUrl="https://wagmi.sh/core/api/actions/sendTransaction"
          onPlay={sendSendTransaction}
        />
      </li>

      {networkId && networkId === sepolia.id.toString() && (
        <li className="h-full">
          <MethodCard
            name="eth_sendTransaction (Contract)"
            description="Same as eth_sendTransaction but using a Contract instance to send the transaction. This method will broadcast the transaction and return the transaction hash. It will call USDC contract so you will need to have some in your account. Faucet here: https://faucet.circle.com/"
            docUrl="https://wagmi.sh/core/api/actions/writeContract"
            onPlay={sendSendContractTransaction}
          />
        </li>
      )}

      <li className="h-full">
        <MethodCard
          name="eth_call"
          description="Simulates a transaction call without broadcasting it to the network. This method is used to execute a transaction locally and return the result without changing the blockchain state."
          docUrl="https://wagmi.sh/core/api/actions/call"
          onPlay={sendCall}
        />
      </li>

      <li className="h-full">
        <MethodCard
          name="eth_signTransaction"
          description="Signs a transaction that can be sent to the network. This method does not broadcast the transaction, it only returns the signed transaction data."
          docUrl="https://wagmi.sh/core/api/actions/signTransaction"
          onPlay={sendSignTransaction}
        />
      </li>

      <li className="h-full">
        <MethodCard
          name="eth_signTypedData"
          description="Signs typed data and calculating an Ethereum-specific EIP-712 signature."
          docUrl="https://wagmi.sh/core/api/actions/signTypedData"
          onPlay={sendSignTypedData}
        />
      </li>

      <li className="h-full">
        <MethodCard
          name="eth_signMessage"
          description="Signs a message and calculating an Ethereum-specific EIP-191 signature."
          docUrl="https://wagmi.sh/core/api/actions/signMessage"
          onPlay={sendSignMessage}
        />
      </li>
    </Fragment>
  );
}
