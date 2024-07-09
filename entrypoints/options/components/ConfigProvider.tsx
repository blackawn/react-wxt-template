import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react'
import tailwindColor from 'tailwindcss/colors'
import type { ThemeConfig } from 'antd'

export type Theme = 'dark' | 'light' | 'system'

export type TailwindColor = Partial<typeof tailwindColor>

type Color = keyof TailwindColor

interface ConfigProviderProps {
  children: (data: {
    theme: Theme
    color: Color
    token: ThemeConfig['token']
    setTheme: React.Dispatch<React.SetStateAction<Theme>>
    darkTheme: boolean
    setColor: (color: Color) => void
    setToken: (value: ThemeConfig['token']) => void
  }) => React.ReactNode
  defaultTheme?: Theme
  defaultColor?: Color
  storageColorKey?: string
  storageThemeKey?: string
}

export const ConfigContext = createContext<any>(null)

const rootElement = window.document.documentElement

const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

export const colors: TailwindColor = {}

Object.keys(tailwindColor).forEach((key) => {
  const descriptor = Object.getOwnPropertyDescriptor(tailwindColor, key)
  if (
    descriptor &&
    typeof descriptor.get === 'undefined' &&
    typeof (tailwindColor as any)[key] === 'object'
  ) {
    colors[key as Color] = (tailwindColor as any)[key]
  }
})

export const ConfigProvider: React.FC<ConfigProviderProps> = ({
  children,
  defaultTheme = 'system',
  defaultColor = 'neutral',
  storageColorKey,
  storageThemeKey,
  ...props
}) => {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem('theme') as Theme) || defaultTheme,
  )

  const [darkTheme, setDarkTheme] = useState(true)

  const [color, setColor] = useState<Color>(
    () => (localStorage.getItem('color') as Color) || defaultColor,
  )

  const [token, _setToken] = useState<ThemeConfig['token']>(() => ({
    colorPrimary: colors[color]?.[500],
  }))

  const value = {
    theme,
    color,
    token,
    setTheme,
    darkTheme,
    setColor: (color: Color) => {
      setColor(color)
      localStorage['color'] = color
    },
    setToken: (value: ThemeConfig['token']) => {
      _setToken((prevToken) => ({
        ...prevToken,
        ...value,
      }))
    },
  }

  const modifyClass = () => {
    if (
      localStorage['theme'] === 'dark' ||
      (!('theme' in localStorage) && mediaQuery.matches)
    ) {
      setDarkTheme(true)
      rootElement.classList.add('dark')
    } else {
      setDarkTheme(false)
      rootElement.classList.remove('dark')
    }
  }

  const modifyThemeFromStorage = () => {
    const storageTheme = localStorage['theme'] as Theme
    if (['light', 'dark'].includes(storageTheme)) {
      setTheme(storageTheme)
    } else {
      setTheme('system')
    }
  }

  useEffect(() => {
    if (theme === 'system') {
      localStorage.removeItem('theme')
    } else if (['light', 'dark'].includes(theme)) {
      localStorage['theme'] = theme
    }

    modifyClass()
  }, [theme])

  useLayoutEffect(() => {
    mediaQuery.addEventListener('change', modifyClass)

    window.addEventListener('storage', modifyThemeFromStorage)

    return () => {
      mediaQuery.removeEventListener('change', modifyClass)

      window.removeEventListener('storage', modifyThemeFromStorage)
    }
  }, [])

  return (
    <ConfigContext.Provider
      value={value}
      {...props}
    >
      {children(value)}
    </ConfigContext.Provider>
  )
}

export default ConfigProvider

export const useConfig = () => {
  const context = useContext(ConfigContext)

  if (context === undefined)
    throw new Error('useConfig must be used within a ConfigProvider')

  return context
}
