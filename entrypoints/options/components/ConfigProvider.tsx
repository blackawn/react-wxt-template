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

interface ConfigContextProps {
  theme: Theme
  color: Color
  token: ThemeConfig['token']
  setTheme: React.Dispatch<React.SetStateAction<Theme>>
  darkTheme: boolean
  setColor: (color: Color) => void
  setToken: (value: ThemeConfig['token']) => void
}
interface ConfigProviderProps {
  children: (data: ConfigContextProps) => React.ReactNode
  defaultTheme?: Theme
  defaultColor?: Color
  storageColorKey?: string
  storageThemeKey?: string
}

export const ConfigContext = createContext<ConfigContextProps>({
  theme: 'system',
  color: 'neutral',
  token: {},
  darkTheme: true,
  setColor: () => void 0,
  setTheme: () => void 0,
  setToken: () => void 0,
})

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
  storageThemeKey = 'theme',
  storageColorKey = 'color',
  ...props
}) => {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageThemeKey) as Theme) || defaultTheme,
  )

  const [darkTheme, setDarkTheme] = useState(
    () =>
      localStorage[storageThemeKey] === 'dark' ||
      (!(storageThemeKey in localStorage) && mediaQuery.matches),
  )

  const [color, setColor] = useState<Color>(
    () => (localStorage.getItem(storageColorKey) as Color) || defaultColor,
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
      localStorage[storageColorKey] = color
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
      localStorage[storageThemeKey] === 'dark' ||
      (!(storageThemeKey in localStorage) && mediaQuery.matches)
    ) {
      setDarkTheme(true)
      rootElement.classList.add('dark')
    } else {
      setDarkTheme(false)
      rootElement.classList.remove('dark')
    }
  }

  const modifyThemeFromStorage = () => {
    const storageTheme = localStorage[storageThemeKey] as Theme
    if (['light', 'dark'].includes(storageTheme)) {
      setTheme(storageTheme)
    } else {
      setTheme('system')
    }
  }

  useEffect(() => {
    if (theme === 'system') {
      localStorage.removeItem(storageThemeKey)
    } else if (['light', 'dark'].includes(theme)) {
      localStorage[storageThemeKey] = theme
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
