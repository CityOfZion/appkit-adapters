import { parseEther } from 'viem'
import { call, signMessage, signTypedData } from '@wagmi/core'
import { Fragment } from 'react'
import {
  sendAntiMevTransaction,
  sendTransaction,
  signAntiMevTransaction,
  signTransaction,
} from '@cityofzion/appkit-neox-adapter'
import type { Hex } from 'viem'
import { MethodCard } from '@/components/method-card'
import { useRequest } from '@/hooks/use-request'
import { useConnection } from '@/hooks/use-connection'
import { AppKitHelper } from '@/helpers/appkit'

export function NeoxMethods() {
  const { request } = useRequest()

  const {
    connectionInfo: { address, networkId },
  } = useConnection<true>()

  function sendSendTransaction() {
    request(
      'eth_sendTransaction',
      async () =>
        await sendTransaction(AppKitHelper.eip155Adapter.wagmiConfig, {
          to: address as Hex,
          value: parseEther('0.000001'),
        })
    )
  }

  function sendSendAntiMevTransaction() {
    request(
      'eth_sendTransaction',
      async () =>
        await sendAntiMevTransaction(AppKitHelper.eip155Adapter.wagmiConfig, {
          to: address as Hex,
          value: parseEther('0.000001'),
        })
    )
  }

  function sendCall() {
    request(
      'eth_call',
      async () =>
        await call(AppKitHelper.eip155Adapter.wagmiConfig, {
          to: address as Hex,
          value: parseEther('0.000001'),
        })
    )
  }

  function sendSignTransaction() {
    request(
      'eth_signTransaction',
      async () =>
        await signTransaction(AppKitHelper.eip155Adapter.wagmiConfig, {
          to: address as Hex,
          value: parseEther('0.000001'),
        })
    )
  }

  function sendSignAntiMevTransaction() {
    request(
      'eth_signTransaction',
      async () =>
        await signAntiMevTransaction(AppKitHelper.eip155Adapter.wagmiConfig, {
          to: address as Hex,
          value: parseEther('0.000001'),
        })
    )
  }

  function sendSignTypedData() {
    request(
      'eth_signTypedData',
      async () =>
        await signTypedData(AppKitHelper.eip155Adapter.wagmiConfig, {
          domain: {
            name: 'Ether Mail',
            version: '1',
            chainId: BigInt(networkId),
            verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
          },
          types: {
            EIP712Domain: [
              { name: 'name', type: 'string' },
              { name: 'version', type: 'string' },
              { name: 'chainId', type: 'uint256' },
              { name: 'verifyingContract', type: 'address' },
            ],
            Person: [
              { name: 'name', type: 'string' },
              { name: 'wallet', type: 'address' },
            ],
            Mail: [
              { name: 'from', type: 'Person' },
              { name: 'to', type: 'Person' },
              { name: 'contents', type: 'string' },
            ],
          },
          primaryType: 'Mail',
          message: {
            from: {
              name: 'Cow',
              wallet: '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
            },
            to: {
              name: 'Bob',
              wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
            },
            contents: 'Hello, Bob!',
          },
        })
    )
  }

  function sendSignMessage() {
    request(
      'eth_signMessage',
      async () =>
        await signMessage(AppKitHelper.eip155Adapter.wagmiConfig, {
          message: `Hello, ${address}`,
        })
    )
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

      <li className="h-full">
        <MethodCard
          name="eth_sendTransaction (Anti-MEV)"
          description="Sends a transaction to the network using Anti-MEV. It requests multiple signatures from the wallet."
          docUrl="https://xdocs.ngd.network/security/anti-mev-protection"
          onPlay={sendSendAntiMevTransaction}
        />
      </li>

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
          description="Signs a transaction. This method will return the signed transaction data that can be broadcasted to the network."
          docUrl="https://wagmi.sh/core/api/actions/signTransaction"
          onPlay={sendSignTransaction}
        />
      </li>

      <li className="h-full">
        <MethodCard
          name="eth_signTransaction (Anti-MEV)"
          description="Signs a transaction using Anti-MEV. It requests multiple signatures from the wallet. This method will return the signed transaction data that can be broadcasted to the network."
          docUrl="https://xdocs.ngd.network/security/anti-mev-protection"
          onPlay={sendSignAntiMevTransaction}
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
  )
}
