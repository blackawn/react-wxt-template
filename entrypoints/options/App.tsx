import { ConfigProvider as AntdConfigProvider, theme as antdTheme } from 'antd'
import Layout from './views/layout'
import { ConfigProvider } from './components/ConfigProvider'

const App = () => {
  return (
    <ConfigProvider>
      {({ darkTheme, token }) => (
        <AntdConfigProvider
          theme={{
            token,
            hashed: false,
            algorithm: darkTheme
              ? antdTheme.darkAlgorithm
              : antdTheme.defaultAlgorithm,
          }}
        >
          <Layout />
        </AntdConfigProvider>
      )}
    </ConfigProvider>
  )
}

export default App
