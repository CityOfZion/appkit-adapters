import { Buffer } from 'buffer'
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

  const networkPassphrase = activeCaipNetwork.id === 'pubnet' ? stellarSDK.Networks.PUBLIC : stellarSDK.Networks.TESTNET

  function getServer() {
    return new stellarSDK.rpc.Server(activeCaipNetwork.rpcUrls.default.http[0])
  }

  function getAccount() {
    return new stellarSDK.Account(address, '-1')
  }

  function buildTransactionXDR(account: stellarSDK.Account = getAccount()) {
    const tx = new stellarSDK.TransactionBuilder(account, {
      fee: stellarSDK.BASE_FEE,
      networkPassphrase,
    })
      .setTimeout(0)
      .addOperation(
        stellarSDK.Operation.manageData({
          name: 'Hello',
          value: address,
        })
      )
      .build()

    return tx.toXDR()
  }

  function sendSignTransaction() {
    request('signTransaction', async () => walletProvider.signTransaction(buildTransactionXDR()))
  }

  function sendSignAndSubmitTransaction() {
    request('signAndSubmitTransaction', async () => {
      const account = await getServer().getAccount(address)

      return walletProvider.signAndSubmitTransaction(buildTransactionXDR(account))
    })
  }

  function sendSignMessage() {
    request('signMessage', async () => walletProvider.signMessage(`Hello, ${address}`))
  }

  function sendSignAuthEntry() {
    request('signAuthEntry', async () => {
      const server = getServer()

      const contract = new stellarSDK.Contract(
        activeCaipNetwork.id === 'pubnet'
          ? 'CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA'
          : 'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC'
      )

      const operation = contract.call(
        'transfer',
        stellarSDK.nativeToScVal(address, { type: 'address' }), // from
        stellarSDK.nativeToScVal(address, { type: 'address' }), // to
        stellarSDK.nativeToScVal(1000000, { type: 'i128' }) // amount
      )

      const transaction = new stellarSDK.TransactionBuilder(getAccount(), {
        fee: stellarSDK.BASE_FEE,
        networkPassphrase,
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
      const latestLedger = await server.getLatestLedger()

      const authPreimage = new stellarSDK.xdr.HashIdPreimageSorobanAuthorization({
        networkId: stellarSDK.hash(Buffer.from(networkPassphrase)),
        nonce: stellarSDK.xdr.Int64.fromString(Math.floor(Math.random() * 1000000000).toString()),
        signatureExpirationLedger: latestLedger.sequence + 100,
        invocation: authEntry.rootInvocation(),
      })

      const hashIdPreimage = stellarSDK.xdr.HashIdPreimage.envelopeTypeSorobanAuthorization(authPreimage)
      const preimageXDR = hashIdPreimage.toXDR('base64')

      return await walletProvider.signAuthEntry(preimageXDR)
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
          docUrl="https://docs.freighter.app/extension-freighter-api/signing#signtransaction"
          onPlay={sendSignTransaction}
        />
      </li>

      <li className="h-full">
        <MethodCard
          name="signAndSubmitTransaction"
          description="Sign and broadcasting the transaction using the connected wallet"
          docUrl="https://docs.freighter.app/extension-freighter-api/signing#signtransaction"
          onPlay={sendSignAndSubmitTransaction}
        />
      </li>

      <li className="h-full">
        <MethodCard
          name="signMessage"
          description="Sign a message with the connected wallet."
          docUrl="https://docs.freighter.app/extension-freighter-api/signing#signmessage"
          onPlay={sendSignMessage}
        />
      </li>

      <li className="h-full">
        <MethodCard
          name="signAuthEntry"
          description="Sign an authentication entry with the connected wallet."
          docUrl="https://docs.freighter.app/extension-freighter-api/signing#signauthentry"
          onPlay={sendSignAuthEntry}
        />
      </li>

      <li className="h-full">
        <MethodCard
          name="getNetwork"
          description="Get the current network the wallet is connected to."
          docUrl="https://docs.freighter.app/extension-freighter-api/reading-data#getnetwork"
          onPlay={sendGetNetwork}
        />
      </li>
    </Fragment>
  )
}
