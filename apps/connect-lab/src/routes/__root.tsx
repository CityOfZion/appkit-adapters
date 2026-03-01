import { TanStackDevtools } from '@tanstack/react-devtools'
import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { ThemeProvider } from '@/contexts/theme'
import { RequestProvider } from '@/contexts/request'
import { ConnectionProvider } from '@/contexts/connection'
import { AppKitHelper } from '@/helpers/appkit'

import './styles.css'

AppKitHelper.setup()

export const Route = createRootRoute({
  component: () => (
    <ThemeProvider defaultTheme="dark">
      <ConnectionProvider>
        <RequestProvider>
          <Outlet />
        </RequestProvider>
      </ConnectionProvider>

      <TanStackDevtools
        config={{ position: 'bottom-right' }}
        plugins={[
          {
            name: 'Tanstack Router',
            render: <TanStackRouterDevtoolsPanel />,
          },
        ]}
      />
    </ThemeProvider>
  ),
})
