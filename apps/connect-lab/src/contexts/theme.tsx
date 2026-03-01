import { createContext, useEffect, useState } from 'react'

type TTheme = 'dark' | 'light' | 'system'

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: TTheme
  storageKey?: string
}

type TThemeProviderState = {
  theme: TTheme
  handleSetTheme: (newTheme: TTheme) => void
}

export const ThemeProviderContext = createContext<TThemeProviderState | null>(null)

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'theme',
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<TTheme>(() => (localStorage.getItem(storageKey) || defaultTheme) as TTheme)

  const handleSetTheme = (newTheme: TTheme) => {
    localStorage.setItem(storageKey, newTheme)
    setTheme(newTheme)
  }

  useEffect(() => {
    const root = window.document.documentElement

    root.classList.remove('light', 'dark')

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'

      root.classList.add(systemTheme)
      return
    }

    root.classList.add(theme)
  }, [theme])

  return (
    <ThemeProviderContext.Provider {...props} value={{ theme, handleSetTheme }}>
      {children}
    </ThemeProviderContext.Provider>
  )
}
