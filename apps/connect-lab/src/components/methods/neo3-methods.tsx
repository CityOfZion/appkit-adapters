import { wallet } from "@cityofzion/neon-js";
import { type Neo3Provider } from "@cityofzion/appkit-neo3-adapter";

import { MethodCard } from "@/components/method-card";
import { useRequest } from "@/hooks/use-request";
import { SignMessageVersion } from "@cityofzion/neon-dappkit-types";
import { useAppKitProvider } from "@reown/appkit/react";
import { Fragment } from "react";
import { useConnection } from "@/hooks/use-connection";

export function Neo3Methods() {
  const { request } = useRequest();
  const {
    connectionInfo: { address, namespace },
  } = useConnection<true>();
  const { walletProvider } = useAppKitProvider<Neo3Provider>(namespace);

  function sendInvokeFunction() {
    request("invokeFunction", async () =>
      walletProvider.invokeFunction({
        invocations: [
          {
            scriptHash: "0xd2a4cff31913016155e38e474a2c06d08be276cf",
            operation: "transfer",
            args: [
              {
                type: "Hash160",
                value: address ?? "",
              },
              {
                type: "Hash160",
                value: "NbnjKGMBJzJ6j5PHeYhjJDaQ5Vy5UYu4Fv",
              },
              {
                type: "Integer",
                value: "100000000",
              },
              {
                type: "Array",
                value: [],
              },
            ],
          },
        ],
        signers: [{ scopes: 1 }],
      }),
    );
  }

  function sendTestInvoke() {
    request("testInvoke", async () =>
      walletProvider.testInvoke({
        invocations: [
          {
            scriptHash: "0xd2a4cff31913016155e38e474a2c06d08be276cf",
            operation: "balanceOf",
            args: [
              {
                type: "Hash160",
                value: address ?? "",
              },
            ],
          },
        ],
        signers: [{ scopes: 1 }],
      }),
    );
  }

  function sendCalculateFee() {
    request("calculateFee", async () =>
      walletProvider.calculateFee({
        invocations: [
          {
            scriptHash: "0xd2a4cff31913016155e38e474a2c06d08be276cf",
            operation: "transfer",
            args: [
              {
                type: "Hash160",
                value: address ?? "",
              },
              {
                type: "Hash160",
                value: "NbnjKGMBJzJ6j5PHeYhjJDaQ5Vy5UYu4Fv",
              },
              {
                type: "Integer",
                value: "100000000",
              },
              {
                type: "Array",
                value: [],
              },
            ],
          },
        ],
        signers: [{ scopes: 1 }],
      }),
    );
  }

  function sendSignTransaction() {
    request("signTransaction", async () => {
      const payer = new wallet.Account(address);
      const owner = new wallet.Account("NbHReXhURGYsochk4uYt7StMAurdEn8Yor");

      return walletProvider.signTransaction({
        invocations: [
          {
            scriptHash: "0xd2a4cff31913016155e38e474a2c06d08be276cf",
            operation: "transfer",
            args: [
              // the owner is sending to payer but the payer is paying for the tx
              { type: "Hash160", value: owner.address }, // owner address
              { type: "Hash160", value: payer.address }, // payer address
              { type: "Integer", value: "100000000" },
              { type: "Array", value: [] },
            ],
          },
        ],
        signers: [
          { account: payer.scriptHash, scopes: "CalledByEntry" },
          { account: owner.scriptHash, scopes: "CalledByEntry" },
        ],
      });
    });
  }

  function sendSignMessage() {
    request("signMessage", async () =>
      walletProvider.signMessage({
        message: `Hello, ${address}`,
        version: SignMessageVersion.DEFAULT,
      }),
    );
  }

  function sendVerifyMessage() {
    request("verifyMessage", async () => {
      const signedMessage = await walletProvider.signMessage({
        message: `Hello, ${address}`,
        version: SignMessageVersion.DEFAULT,
      });

      return await walletProvider.verifyMessage(signedMessage);
    });
  }

  function sendGetWalletInfo() {
    request("getWalletInfo", async () => walletProvider.getWalletInfo());
  }

  const sendEncrypt = async () => {
    request("encrypt", async () => walletProvider.encrypt("My secret message"));
  };

  const sendDecrypt = async () => {
    request("decrypt", async () => {
      const [encryptedMessage] =
        await walletProvider.encrypt("My secret message");
      return walletProvider.decrypt(encryptedMessage);
    });
  };

  const sendDecryptFromArray = async () => {
    request("decrypt", async () => {
      const [encryptedMessage] =
        await walletProvider.encrypt("My secret message");

      const [encryptedMessage2] = await walletProvider.encrypt(
        "My second secret message",
      );

      return walletProvider.decryptFromArray([
        encryptedMessage,
        encryptedMessage2,
      ]);
    });
  };

  return (
    <Fragment>
      <li className="h-full">
        <MethodCard
          name="invokeFunction"
          description="Invokes a smart contract function on the blockchain, signing and broadcasting the transaction using the connected wallet."
          docUrl="https://github.com/CityOfZion/neon-dappkit/blob/main/packages/neon-dappkit/NEON-INVOKER.md#invoking-a-smartcontract-method-on-neo-3-blockchain"
          onPlay={sendInvokeFunction}
        />
      </li>

      <li className="h-full">
        <MethodCard
          name="testInvoke"
          description="Simulates a smart contract function invocation without broadcasting it, allowing validation of execution results and fee estimation."
          docUrl="https://github.com/CityOfZion/neon-dappkit/blob/main/packages/neon-dappkit/NEON-INVOKER.md#invoking-a-smartcontract-method-on-neo-3-blockchain"
          onPlay={sendTestInvoke}
        />
      </li>

      <li className="h-full">
        <MethodCard
          name="calculateFee"
          description="Calculates the estimated system and network fees required for a transaction."
          docUrl="https://github.com/CityOfZion/neon-dappkit/blob/main/packages/neon-dappkit/NEON-INVOKER.md#calculate-fee"
          onPlay={sendCalculateFee}
        />
      </li>

      <li className="h-full">
        <MethodCard
          name="signTransaction"
          description="Signs a Neo transaction with the user’s wallet without broadcasting it to the network."
          docUrl="https://github.com/CityOfZion/neon-dappkit/blob/main/packages/neon-dappkit/NEON-INVOKER.md#signing-a-transaction-using-multiple-accounts-of-different-environmentswallets"
          onPlay={sendSignTransaction}
        />
      </li>

      <li className="h-full">
        <MethodCard
          name="signMessage"
          description="Signs an arbitrary message using the wallet’s private key for off-chain authentication or verification."
          docUrl="https://github.com/CityOfZion/neon-dappkit/blob/main/packages/neon-dappkit/NEON-SIGNER.md#sign-and-verify-message"
          onPlay={sendSignMessage}
        />
      </li>

      <li className="h-full">
        <MethodCard
          name="verifyMessage"
          description="Verifies that a signed message was produced by the owner of a given Neo address."
          docUrl="https://github.com/CityOfZion/neon-dappkit/blob/main/packages/neon-dappkit/NEON-SIGNER.md#sign-and-verify-message"
          onPlay={sendVerifyMessage}
        />
      </li>

      <li className="h-full">
        <MethodCard
          name="getWalletInfo"
          description="Returns basic information about the connected wallet, including if the wallet is a hardware wallet."
          onPlay={sendGetWalletInfo}
        />
      </li>

      <li className="h-full">
        <MethodCard
          name="encrypt"
          description="Encrypts arbitrary data using the wallet’s cryptographic features for secure storage or transmission."
          docUrl="https://github.com/CityOfZion/neon-dappkit/blob/main/packages/neon-dappkit/NEON-SIGNER.md#encrypt-and-decrypt-data"
          onPlay={sendEncrypt}
        />
      </li>

      <li className="h-full">
        <MethodCard
          name="decrypt"
          description="Decrypts data that was previously encrypted using the wallet."
          docUrl="https://github.com/CityOfZion/neon-dappkit/blob/main/packages/neon-dappkit/NEON-SIGNER.md#encrypt-and-decrypt-data"
          onPlay={sendDecrypt}
        />
      </li>

      <li className="h-full">
        <MethodCard
          name="decryptFromArray"
          description="Decrypts multiple encrypted payloads in a single request."
          docUrl="https://github.com/CityOfZion/neon-dappkit/blob/main/packages/neon-dappkit/NEON-SIGNER.md#encrypt-and-decrypt-data"
          onPlay={sendDecryptFromArray}
        />
      </li>
    </Fragment>
  );
}
