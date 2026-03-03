import { TanStackDevtools } from '@tanstack/react-devtools'
import { Link, Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { Github } from 'lucide-react'
import { ThemeProvider } from '@/contexts/theme'
import { RequestProvider } from '@/contexts/request'
import { ConnectionProvider } from '@/contexts/connection'
import { AppKitHelper } from '@/helpers/appkit'

import './styles.css'
import { InteractiveBackground } from '@/components/interactive-background'
import { Button } from '@/components/ui/button'

AppKitHelper.setup()

export const Route = createRootRoute({
  component: () => (
    <ThemeProvider defaultTheme="dark">
      <ConnectionProvider>
        <RequestProvider>
          <div className="relative flex min-h-screen w-screen flex-col items-center px-10">
            <InteractiveBackground />

            <div className="flex w-full justify-end pt-4 pb-8">
              <Button variant="secondary" asChild>
                <Link
                  to={'https://github.com/CityOfZion/appkit-adapters' as string}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="size-5" />
                  Github
                </Link>
              </Button>
            </div>

            <div className="flex w-full max-w-7xl flex-col items-center">
              <Outlet />
            </div>
          </div>
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
