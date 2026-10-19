import { TanStackDevtools } from '@tanstack/react-devtools'
import { Link, Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { Fragment } from 'react'
import { RequestProvider } from '@/contexts/request'
import { ConnectionProvider } from '@/contexts/connection'
import { AppKitHelper } from '@/helpers/appkit'
import { InteractiveBackground } from '@/components/interactive-background'
import { Button } from '@/components/ui/button'
import COZ from '@/assets/icons/coz.svg?react'
import GithubIcon from '@/assets/icons/github-icon.svg?react'

import './styles.css'

AppKitHelper.setup()

export const Route = createRootRoute({
  component: () => (
    <Fragment>
      <ConnectionProvider>
        <RequestProvider>
          <InteractiveBackground />

          <div className="relative flex w-full max-w-7xl grow flex-col items-center gap-8 p-4 pb-8">
            <header className="flex w-full justify-end gap-2">
              <Button variant="secondary" asChild>
                <Link
                  to={'https://github.com/CityOfZion/appkit-adapters' as string}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <GithubIcon aria-hidden className="size-5" />
                  Github
                </Link>
              </Button>

              <Button variant="secondary" asChild>
                <Link to={'https://coz.io/' as string} target="_blank" rel="noopener noreferrer">
                  <COZ aria-hidden className="size-5" />
                  COZ
                </Link>
              </Button>
            </header>

            <main className="flex h-full w-full flex-col items-center">
              <Outlet />
            </main>
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
    </Fragment>
  ),
})
