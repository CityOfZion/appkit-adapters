import { RefreshCw } from 'lucide-react'

import { StyleHelper } from '@/helpers/style'

function Spinner({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <RefreshCw role="status" aria-label="Loading" className={StyleHelper.merge('animate-spin', className)} {...props} />
  )
}

export { Spinner }
