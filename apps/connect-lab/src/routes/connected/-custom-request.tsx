import { useAppKitProvider } from '@reown/appkit-controllers/react'
import { ClipboardPaste, Play } from 'lucide-react'
import { useState } from 'react'
import { RecursiveParam } from './-recursive-param'
import { ImportJsonModal } from './-import-json-modal'
import type { Provider } from '@reown/appkit-controllers'
import type { TParamNode } from './-recursive-param'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { useConnection } from '@/hooks/use-connection'
import { useRequest } from '@/hooks/use-request'

const convertJsonToParamNode = (data: any, key?: string): TParamNode => {
  const id = Date.now() + Math.random()

  if (Array.isArray(data)) {
    return {
      id,
      type: 'array',
      key,
      children: data.map(item => convertJsonToParamNode(item)),
    }
  }

  if (data !== null && typeof data === 'object') {
    return {
      id,
      type: 'object',
      key,
      children: Object.entries(data).map(([k, v]) => convertJsonToParamNode(v, k)),
    }
  }

  if (typeof data === 'number') {
    return {
      id,
      type: 'number',
      value: String(data),
      key,
    }
  }

  return {
    id,
    type: 'string',
    value: String(data),
    key,
  }
}

const serializeNode = (node: TParamNode): any => {
  if (node.type === 'string') {
    return node.value
  }

  if (node.type === 'number') {
    return Number(node.value)
  }

  if (node.type === 'array') {
    return node.children?.map(serializeNode) || []
  }

  const obj: Record<string, any> = {}
  node.children?.forEach(child => {
    if (child.key) obj[child.key] = serializeNode(child)
  })

  return obj
}

export function CustomRequest() {
  const {
    connectionInfo: { namespace },
  } = useConnection<true>()
  const { request } = useRequest()

  const { walletProvider } = useAppKitProvider<Provider>(namespace)

  const [method, setMethod] = useState('')
  const [paramRoot, setParamRoot] = useState<TParamNode>({ id: Date.now(), type: 'string', value: '' })

  const handleImportJson = (json: string) => {
    const parsed = JSON.parse(json)
    setParamRoot(convertJsonToParamNode(parsed))
  }

  function handleExecute() {
    request(method, async () => {
      const params = serializeNode(paramRoot)

      return await walletProvider.request({
        method,
        params: params,
      })
    })
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <Label>Method</Label>
        <Input placeholder="e.g. eth_getBalance" type="text" value={method} onChange={e => setMethod(e.target.value)} />
      </div>

      <div className="flex flex-col gap-4">
        <div className="justi flex items-center justify-between">
          <Label>Parameters</Label>

          <ImportJsonModal onConfirm={handleImportJson}>
            <Button variant="outline" size="sm">
              <ClipboardPaste aria-hidden className="size-4" />
              Import JSON
            </Button>
          </ImportJsonModal>
        </div>

        <div className="animate-in slide-in-from-left-2 duration-300">
          <RecursiveParam
            node={paramRoot}
            isRoot={true}
            onUpdate={updated => setParamRoot(updated)}
            onDelete={() => {}}
          />
        </div>
      </div>

      <Button className="h-12" variant="default" onClick={handleExecute} disabled={!method.trim()}>
        <Play aria-hidden className="fill-current" />
        Execute
      </Button>
    </div>
  )
}
