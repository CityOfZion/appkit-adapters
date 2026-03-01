import { useAppKitProvider } from '@reown/appkit/react'
import { Fragment } from 'react'
import * as stellarSDK from '@stellar/stellar-sdk'
import type { StellarProvider } from '@cityofzion/appkit-stellar-adapter'
import { MethodCard } from '@/components/method-card'
import { useRequest } from '@/hooks/use-request'
import { useConnection } from '@/hooks/use-connection'

export function StellarMethods() {
  const { request } = useRequest()
  const {
    connectionInfo: { address, activeCaipNetwork, namespace },
  } = useConnection<true>()
  const { walletProvider } = useAppKitProvider<StellarProvider>(namespace)

  function sendSignTransaction() {
    request('signTransaction', async () => {
      const account = new stellarSDK.Account(address, '-1')
      const tx = new stellarSDK.TransactionBuilder(account, {
        fee: stellarSDK.BASE_FEE,
        networkPassphrase: activeCaipNetwork.id === 'pubnet' ? stellarSDK.Networks.PUBLIC : stellarSDK.Networks.TESTNET,
      })
        .setTimeout(0)
        .addOperation(
          stellarSDK.Operation.manageData({
            name: 'Hello',
            value: address,
          })
        )
        .build()

      return await walletProvider.signTransaction(tx.toXDR())
    })
  }

  function sendSignAndSubmitTransaction() {
    request('signAndSubmitTransaction', async () => {
      const account = new stellarSDK.Account(address, '-1')
      const tx = new stellarSDK.TransactionBuilder(account, {
        fee: stellarSDK.BASE_FEE,
        networkPassphrase: activeCaipNetwork.id === 'pubnet' ? stellarSDK.Networks.PUBLIC : stellarSDK.Networks.TESTNET,
      })
        .setTimeout(0)
        .addOperation(
          stellarSDK.Operation.manageData({
            name: 'Hello',
            value: address,
          })
        )
        .build()

      return await walletProvider.signAndSubmitTransaction(tx.toXDR())
    })
  }

  function sendSignMessage() {
    request('signMessage', async () => walletProvider.signMessage(`Hello, ${address}`))
  }

  function sendSignAuthEntry() {
    request('signAuthEntry', async () => {
      const networkUrl = activeCaipNetwork.rpcUrls.default.http[0]

      const server = new stellarSDK.rpc.Server(networkUrl)

      const contract = new stellarSDK.Contract(
        activeCaipNetwork.id === 'pubnet'
          ? 'CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA'
          : 'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC'
      )

      const account = await server.getAccount(address)

      const operation = contract.call(
        'transfer',
        stellarSDK.nativeToScVal(address, { type: 'address' }), // from
        stellarSDK.nativeToScVal(address, { type: 'address' }), // to
        stellarSDK.nativeToScVal(1000000, { type: 'i128' }) // amount
      )

      const transaction = new stellarSDK.TransactionBuilder(account, {
        fee: stellarSDK.BASE_FEE,
        networkPassphrase: stellarSDK.Networks.TESTNET,
      })
        .addOperation(operation)
        .setTimeout(30)
        .build()

      const simulated = await server.simulateTransaction(transaction)

      if ('error' in simulated) {
        throw new Error(`Simulation failed: ${simulated.error}`)
      }

      if (!simulated.result?.auth || simulated.result.auth.length === 0) {
        throw new Error('No auth entries required')
      }

      const authEntry = simulated.result.auth[0]

      const networkPassphrase =
        activeCaipNetwork.id === 'pubnet' ? stellarSDK.Networks.PUBLIC : stellarSDK.Networks.TESTNET

      const latestLedger = await server.getLatestLedger()
      const signatureExpirationLedger = latestLedger.sequence + 100

      const nonce = stellarSDK.xdr.Int64.fromString(Math.floor(Math.random() * 1000000000).toString())

      const authPreimage = new stellarSDK.xdr.HashIdPreimageSorobanAuthorization({
        networkId: stellarSDK.hash(Buffer.from(networkPassphrase)),
        nonce: nonce,
        signatureExpirationLedger: signatureExpirationLedger,
        invocation: authEntry.rootInvocation(),
      })

      const hashIdPreimage = stellarSDK.xdr.HashIdPreimage.envelopeTypeSorobanAuthorization(authPreimage)

      const preimageXDR = hashIdPreimage.toXDR('base64')

      const response = await walletProvider.signAuthEntry(preimageXDR)

      return response
    })
  }

  function sendGetNetwork() {
    request('getNetwork', async () => walletProvider.getNetwork())
  }

  return (
    <Fragment>
      <li className="h-full">
        <MethodCard
          name="signTransaction"
          description="Sign a transaction with the connected wallet."
          docUrl="https://docs.freighter.app/docs/playground/signTransaction"
          onPlay={sendSignTransaction}
        />
      </li>

      <li className="h-full">
        <MethodCard
          name="signAndSubmitTransaction"
          description="Sign and broadcasting the transaction using the connected wallet"
          docUrl="https://docs.freighter.app/docs/playground/signTransaction"
          onPlay={sendSignAndSubmitTransaction}
        />
      </li>

      <li className="h-full">
        <MethodCard
          name="signMessage"
          description="Sign a message with the connected wallet."
          docUrl="https://docs.freighter.app/docs/playground/signmessage/"
          onPlay={sendSignMessage}
        />
      </li>

      <li className="h-full">
        <MethodCard
          name="signAuthEntry"
          description="Sign an authentication entry with the connected wallet."
          docUrl="https://docs.freighter.app/docs/playground/signAuthEntry"
          onPlay={sendSignAuthEntry}
        />
      </li>

      <li className="h-full">
        <MethodCard
          name="getNetwork"
          description="Get the current network the wallet is connected to."
          docUrl="https://docs.freighter.app/docs/playground/getNetwork"
          onPlay={sendGetNetwork}
        />
      </li>
    </Fragment>
  )
}
