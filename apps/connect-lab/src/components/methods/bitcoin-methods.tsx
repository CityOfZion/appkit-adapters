import { useAppKitProvider } from '@reown/appkit/react'
import { Fragment } from 'react'
import * as bitcoinjs from 'bitcoinjs-lib'
import { BitcoinConstants } from '@cityofzion/appkit-bitcoin-adapter'
import type { BitcoinProvider } from '@cityofzion/appkit-bitcoin-adapter'
import { MethodCard } from '@/components/method-card'
import { useRequest } from '@/hooks/use-request'
import { useConnection } from '@/hooks/use-connection'

type TMempoolUtxo = {
  txid: string
  vout: number
  value: number
  status: { confirmed: boolean }
}

const DOC_URL = 'https://docs.reown.com/advanced/multichain/rpc-reference/bitcoin-rpc'
const FEE_IN_SATOSHIS = 500
const DUST_LIMIT_IN_SATOSHIS = 546

export function BitcoinMethods() {
  const { request } = useRequest()

  const {
    connectionInfo: { address, activeCaipNetwork, namespace },
  } = useConnection<true>()

  const { walletProvider } = useAppKitProvider<BitcoinProvider>(namespace)

  function sendGetAccountAddresses() {
    request('getAccountAddresses', async () => walletProvider.getAccountAddresses({ intentions: ['payment'] }))
  }

  function sendSignMessage() {
    request('signMessage', async () => walletProvider.signMessage({ message: `Hello, ${address}`, address }))
  }

  function sendSignPsbt() {
    request('signPsbt', async () => {
      const mempoolUrl = BitcoinConstants.MEMPOOL_API_URL_BY_ID[activeCaipNetwork.id]
      const response = await fetch(`${mempoolUrl}/address/${address}/utxo`)
      const utxos: Array<TMempoolUtxo> = await response.json()
      const utxo = utxos.find(item => item.status.confirmed && item.value >= FEE_IN_SATOSHIS + DUST_LIMIT_IN_SATOSHIS)

      if (!utxo) {
        throw new Error('No confirmed UTXO with enough balance found')
      }

      const network = activeCaipNetwork.testnet ? bitcoinjs.networks.testnet : bitcoinjs.networks.bitcoin
      const psbt = new bitcoinjs.Psbt({ network })

      psbt.addInput({
        hash: utxo.txid,
        index: utxo.vout,
        witnessUtxo: {
          script: bitcoinjs.address.toOutputScript(address, network),
          value: BigInt(utxo.value),
        },
      })

      psbt.addOutput({
        address,
        value: BigInt(utxo.value - FEE_IN_SATOSHIS),
      })

      return await walletProvider.signPsbt({
        psbt: psbt.toBase64(),
        signInputs: [{ address, index: 0, sighashTypes: [bitcoinjs.Transaction.SIGHASH_ALL] }],
        broadcast: false,
      })
    })
  }

  function sendSendTransfer() {
    request('sendTransfer', async () =>
      walletProvider.sendTransfer({
        recipientAddress: address,
        amount: DUST_LIMIT_IN_SATOSHIS.toString(),
      })
    )
  }

  return (
    <Fragment>
      <li className="h-full">
        <MethodCard
          name="getAccountAddresses"
          description="Get the addresses of the connected account."
          docUrl={`${DOC_URL}#getaccountaddresses`}
          onPlay={sendGetAccountAddresses}
        />
      </li>

      <li className="h-full">
        <MethodCard
          name="signMessage"
          description="Sign a message with the connected wallet."
          docUrl={`${DOC_URL}#signmessage`}
          onPlay={sendSignMessage}
        />
      </li>

      <li className="h-full">
        <MethodCard
          name="signPsbt"
          description="Sign a PSBT that sends a UTXO back to the connected account, without broadcasting it."
          docUrl={`${DOC_URL}#signpsbt`}
          onPlay={sendSignPsbt}
        />
      </li>

      <li className="h-full">
        <MethodCard
          name="sendTransfer"
          description="Send 546 satoshis to the connected account."
          docUrl={`${DOC_URL}#sendtransfer`}
          onPlay={sendSendTransfer}
        />
      </li>
    </Fragment>
  )
}
