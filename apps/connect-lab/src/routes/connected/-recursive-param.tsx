import { Circle, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { StyleHelper } from '@/helpers/style'

export type TNodeType = 'string' | 'number' | 'array' | 'object'

export type TParamNode = {
  id: number
  type: TNodeType
  value?: string
  key?: string
  children?: Array<TParamNode>
}

type TProps = {
  node: TParamNode
  onUpdate: (node: TParamNode) => void
  onDelete: () => void
  isRoot?: boolean
  isObjectChild?: boolean
}

export function RecursiveParam({ node, onUpdate, onDelete, isRoot = false, isObjectChild = false }: TProps) {
  function handleChangeType(newType: TNodeType) {
    const newNode: TParamNode = { ...node, type: newType }
    if (newType === 'array' || newType === 'object') {
      newNode.children = []
      delete newNode.value
    } else {
      newNode.value = ''
      delete newNode.children
    }
    onUpdate(newNode)
  }

  function addChild() {
    const children = [
      ...(node.children || []),
      {
        id: Date.now() + Math.random(),
        type: 'string' as TNodeType,
        value: '',
        key: '',
      },
    ]
    onUpdate({ ...node, children })
  }

  function updateChild(childId: number, updatedChild: TParamNode) {
    const children = node.children?.map(c => (c.id === childId ? updatedChild : c)) || []
    onUpdate({ ...node, children })
  }

  function deleteChild(childId: number) {
    const children = node.children?.filter(c => c.id !== childId) || []
    onUpdate({ ...node, children })
  }

  return (
    <div
      className={StyleHelper.merge('space-y-3', {
        'ml-2 border-l border-white/5 pt-2 pb-1 pl-4 max-sm:ml-0.5 max-sm:pt-1 max-sm:pb-0.5 max-sm:pl-1.5': !isRoot,
      })}
    >
      <div className="group animate-in fade-in slide-in-from-left-1 flex flex-col gap-2 duration-300">
        {isObjectChild && (
          <Input
            type="text"
            placeholder="Key"
            value={node.key || ''}
            onChange={e => onUpdate({ ...node, key: e.target.value })}
            className="w-full text-emerald-500 focus-visible:border-emerald-500/30 max-sm:h-8 max-sm:rounded-lg max-sm:text-xs"
          />
        )}

        <div className="flex items-center gap-2">
          <Select.Root value={node.type} onValueChange={handleChangeType}>
            <Select.Trigger className="max-sm:h-8 max-sm:min-w-24 max-sm:rounded-lg max-sm:text-xs">
              <Select.Value placeholder="Select type" />
            </Select.Trigger>

            <Select.Content className="max-sm:min-w-24">
              <Select.Item value="string">String</Select.Item>
              <Select.Item value="number">Number</Select.Item>
              <Select.Item value="array">Array</Select.Item>
              <Select.Item value="object">Object</Select.Item>
            </Select.Content>
          </Select.Root>

          {(node.type === 'string' || node.type === 'number') && (
            <Input
              className="max-sm:h-8 max-sm:rounded-lg max-sm:text-xs"
              type={node.type === 'number' ? 'number' : 'text'}
              placeholder="Value"
              value={node.value}
              onChange={e => onUpdate({ ...node, value: e.target.value })}
            />
          )}

          {(node.type === 'array' || node.type === 'object') && (
            <Button
              onClick={addChild}
              className="size-12 text-blue-500 hover:text-blue-500 max-sm:size-8 max-sm:rounded-lg max-sm:text-xs dark:border-blue-500/25 dark:hover:bg-blue-500/10"
              variant="outline"
              size="icon"
              aria-label="Add child"
            >
              <Plus aria-hidden className="size-5 max-sm:size-4" />
            </Button>
          )}

          {!isRoot && (
            <Button
              className="size-12 text-red-500 hover:text-red-500 max-sm:size-8 max-sm:rounded-lg dark:border-red-500/25 dark:hover:bg-red-500/10"
              variant="ghost"
              size="icon"
              aria-label="Delete node"
              onClick={onDelete}
            >
              <Trash2 aria-hidden className="size-5 max-sm:size-4" />
            </Button>
          )}
        </div>
      </div>

      {(node.type === 'array' || node.type === 'object') && (
        <div className="space-y-2">
          {node.children?.length === 0 && (
            <div className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-white/40 py-3 opacity-20 max-sm:py-1.5">
              <Circle aria-hidden className="size-2 fill-current" />
              <span className="font-grotesk text-xs font-bold uppercase italic">Empty {node.type}</span>
            </div>
          )}

          {node.children?.map(child => (
            <RecursiveParam
              key={child.id}
              node={child}
              isObjectChild={node.type === 'object'}
              onUpdate={updated => updateChild(child.id, updated)}
              onDelete={() => deleteChild(child.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
