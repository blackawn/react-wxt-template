import { Button, Dropdown, DropdownProps, MenuProps, Popover } from 'antd'
import {
  BgColorsOutlined,
  ChromeOutlined,
  MoonOutlined,
  SunOutlined,
} from '@ant-design/icons'
import { clsx } from 'clsx'
import {
  useConfig,
  colors,
  Theme,
} from '@/entrypoints/options/components/ConfigProvider'
import { useMemo, useState } from 'react'
import { useViewTransition } from '@/entrypoints/options/hooks/useViewTransition'

const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

const themeMenu = [
  {
    key: 'light',
    label: (
      <div className='flex items-center gap-x-2'>
        <span className='text-lg'>
          <SunOutlined />
        </span>
        <span>日间模式</span>{' '}
      </div>
    ),
    ico: <SunOutlined />,
  },
  {
    key: 'dark',
    label: (
      <div className='flex items-center gap-x-2'>
        <span className='text-lg'>
          <MoonOutlined />
        </span>
        <span>夜间默认</span>{' '}
      </div>
    ),
    ico: <MoonOutlined />,
  },
  {
    key: 'system',
    label: (
      <div className='flex items-center gap-x-2'>
        <span className='text-lg'>
          <ChromeOutlined />
        </span>
        <span>跟随系统</span>{' '}
      </div>
    ),
    ico: <ChromeOutlined />,
  },
]

const ColorPanel: React.FC<any> = () => {
  const { color, setColor, setToken } = useConfig()

  const handleSetColor = (colorValue: keyof typeof colors) => {
    setColor(colorValue)
    setToken({
      colorPrimary: colors[colorValue]?.[500],
    })
  }

  const Content: React.FC<any> = () => {
    return (
      <div className='grid grid-cols-6 gap-1'>
        {(Object.keys(colors) as Array<keyof typeof colors>).map(
          (colorValue) => (
            <div
              key={colorValue}
              className={clsx([
                'h-6 w-6 cursor-pointer rounded',
                {
                  'rounded-full': color === colorValue,
                },
              ])}
              style={{
                backgroundColor: (colors as any)[colorValue][500],
              }}
              onClick={() => handleSetColor(colorValue)}
            ></div>
          ),
        )}
      </div>
    )
  }

  return (
    <Popover
      content={<Content />}
      trigger='click'
      placement='bottomRight'
    >
      <Button
        icon={<BgColorsOutlined />}
        shape='circle'
        size='large'
        type='text'
      />
    </Popover>
  )
}

const ThemeMenu: React.FC<any> = () => {
  const { theme, setTheme } = useConfig()

  const [open, setOpen] = useState(false)

  const { startTransition } = useViewTransition()

  const currentThemeMenu = useMemo(() => {
    return themeMenu.find((m) => m.key === theme) || themeMenu[2]
  }, [theme])

  const onMenuClick: MenuProps['onClick'] = ({ key, domEvent }) => {
    if (key === theme) return

    const isSameMode =
      (key === 'system' &&
        ((theme === 'light' && !mediaQuery.matches) ||
          (theme === 'dark' && mediaQuery.matches))) ||
      (theme === 'system' &&
        ((key === 'light' && !mediaQuery.matches) ||
          (key === 'dark' && mediaQuery.matches)))

    if (isSameMode) {
      setTheme(key as Theme)
      return
    }

    startTransition(domEvent as React.MouseEvent<HTMLElement>, () => {
      setTheme(key as Theme)
    })
  }

  const handleOpenChange: DropdownProps['onOpenChange'] = (nextOpen, info) => {
    if (info.source === 'trigger' || nextOpen) {
      setOpen(nextOpen)
    }
  }

  return (
    <Dropdown
      menu={{
        items: themeMenu,
        onClick: onMenuClick,
        selectable: true,
        defaultSelectedKeys: [currentThemeMenu.key],
      }}
      trigger={['click']}
      onOpenChange={handleOpenChange}
      open={open}
      placement='bottomRight'
      arrow
    >
      <Button
        icon={currentThemeMenu.ico}
        size='large'
        shape='circle'
        type='text'
      />
    </Dropdown>
  )
}

const Header: React.FC<any> = () => {
  return (
    <div className='flex p-4'>
      <div className='flex-1'></div>
      <div className='flex gap-x-4'>
        <ColorPanel />
        <ThemeMenu />
      </div>
    </div>
  )
}

export default Header
