import { useContext } from 'react'
import { RequestProviderContext } from '@/contexts/request'

export function useRequest() {
  const context = useContext(RequestProviderContext)

  if (context === null) throw new Error('useRequest must be used within a RequestProvider')

  return context
}
