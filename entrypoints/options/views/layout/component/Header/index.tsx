import { Button, Popover } from 'antd'
import { clsx } from 'clsx'
import {
  useConfig,
  colors,
} from '@/entrypoints/options/components/ConfigProvider'

const ColorPanel: React.FC<any> = () => {
  const { color, setColor, setToken } = useConfig()

  const handleSetColor = (colorValue: keyof typeof colors) => {
    setColor(colorValue)
    setToken({
      colorPrimary: colors[colorValue]?.[500],
    })
  }

  return (
    <div className='grid grid-cols-6 gap-1'>
      {(Object.keys(colors) as Array<keyof typeof colors>).map((colorValue) => (
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
      ))}
    </div>
  )
}

const Header: React.FC<any> = () => {
  const { setTheme } = useConfig()

  return (
    <div className='flex p-4'>
      <div className='flex-1'></div>
      <div className='flex gap-x-4'>
        <Popover
          content={<ColorPanel />}
          trigger='click'
          placement='bottomRight'
        >
          <Button type='primary'>Color</Button>
        </Popover>

        <Button
          type='primary'
          onClick={() => setTheme('light')}
        >
          set light
        </Button>
        <Button onClick={() => setTheme('dark')}>set dark</Button>
        <Button onClick={() => setTheme('system')}>set system</Button>
      </div>
    </div>
  )
}

export default Header
