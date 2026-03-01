import { useAppKitConnection } from '@reown/appkit-adapter-solana/react'
import { useAppKitProvider } from '@reown/appkit/react'
import * as solanaSDK from '@solana/web3.js'
import bs58 from 'bs58'
import { Fragment } from 'react'
import type { Provider } from '@reown/appkit-adapter-solana/react'
import { useRequest } from '@/hooks/use-request'
import { useConnection } from '@/hooks/use-connection'
import { MethodCard } from '@/components/method-card'

export function SolanaMethods() {
  const { request } = useRequest()
  const {
    connectionInfo: { address, namespace },
  } = useConnection<true>()

  const { walletProvider } = useAppKitProvider<Provider>(namespace)
  const { connection } = useAppKitConnection()

  function sendSignAndSendTransaction() {
    request('solana_signAndSendTransaction', async () => {
      if (!address || !connection) return

      const wallet = new solanaSDK.PublicKey(address)

      const latestBlockhash = await connection.getLatestBlockhash()

      const transaction = new solanaSDK.Transaction()
      transaction.recentBlockhash = latestBlockhash.blockhash
      transaction.feePayer = wallet

      transaction.add(
        solanaSDK.SystemProgram.transfer({
          fromPubkey: wallet,
          toPubkey: wallet,
          lamports: 1,
        })
      )

      return await walletProvider.signAndSendTransaction(transaction)
    })
  }

  function sendSignTransaction() {
    request('solana_signTransaction', async () => {
      if (!address || !connection) return

      const wallet = new solanaSDK.PublicKey(address)

      const latestBlockhash = await connection.getLatestBlockhash()

      const transaction = new solanaSDK.Transaction()
      transaction.recentBlockhash = latestBlockhash.blockhash
      transaction.feePayer = wallet

      transaction.add(
        solanaSDK.SystemProgram.transfer({
          fromPubkey: wallet,
          toPubkey: wallet,
          lamports: 1,
        })
      )

      return await walletProvider.signTransaction(transaction)
    })
  }

  function sendSignAllTransaction() {
    request('solana_signTransaction', async () => {
      if (!address || !connection) return

      const wallet = new solanaSDK.PublicKey(address)

      const latestBlockhash = await connection.getLatestBlockhash()

      const transaction = new solanaSDK.Transaction()
      transaction.recentBlockhash = latestBlockhash.blockhash
      transaction.feePayer = wallet

      transaction.add(
        solanaSDK.SystemProgram.transfer({
          fromPubkey: wallet,
          toPubkey: wallet,
          lamports: 1,
        })
      )

      return await walletProvider.signAllTransactions([transaction])
    })
  }

  function sendSignMessage() {
    request('solana_signMessage', async () => {
      const encodedMessage = new TextEncoder().encode(`Hello, ${address}`)
      const signedMessage = await walletProvider.signMessage(encodedMessage)
      return bs58.encode(signedMessage)
    })
  }

  function sendGetAccounts() {
    request('solana_getAccounts', async () => await walletProvider.getAccounts())
  }

  return (
    <Fragment>
      <li className="h-full">
        <MethodCard
          name="solana_signAndSendTransaction"
          description="This method is responsible for signing and sending a transaction to the Solana network. The wallet must sent the transaction and return the signature that can be used as a transaction id."
          docUrl="https://docs.reown.com/advanced/multichain/rpc-reference/solana-rpc#solana-signandsendtransaction"
          onPlay={sendSignAndSendTransaction}
        />
      </li>

      <li className="h-full">
        <MethodCard
          name="solana_signTransaction"
          description="This method returns a signature over the provided instructions by the targeted public key."
          docUrl="https://docs.reown.com/advanced/multichain/rpc-reference/solana-rpc#solana-signtransaction"
          onPlay={sendSignTransaction}
        />
      </li>

      <li className="h-full">
        <MethodCard
          name="solana_signAllTransactions"
          docUrl="https://docs.reown.com/advanced/multichain/rpc-reference/solana-rpc#solana-signalltransactions"
          description="This method is responsible for signing a list of transactions. The wallet must sign all transactions and return the signed transactions in the same order as received. Wallets must sign all transactions or return an error if it is not possible to sign any of them."
          onPlay={sendSignAllTransaction}
        />
      </li>

      <li className="h-full">
        <MethodCard
          name="solana_signMessage"
          description="This method returns a signature for the provided message from the requested signer address."
          docUrl="https://docs.reown.com/advanced/multichain/rpc-reference/solana-rpc#solana-signmessage"
          onPlay={sendSignMessage}
        />
      </li>

      <li className="h-full">
        <MethodCard
          name="solana_getAccounts"
          description="This method returns an Array of public keys available to sign from the wallet."
          docUrl="https://docs.reown.com/advanced/multichain/rpc-reference/solana-rpc#solana-getaccounts"
          onPlay={sendGetAccounts}
        />
      </li>
    </Fragment>
  )
}
