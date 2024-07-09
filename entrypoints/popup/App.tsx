import { useState } from 'react'
import reactLogo from '@/assets/react.svg'
import wxtLogo from '/wxt.svg'
import { browser } from 'wxt/browser'

function App() {
  const [count, setCount] = useState(0)

  const handleOpenOptionsPage = () => {
    browser.tabs.create({
      url: './options.html',
    })
  }

  return (
    <>
      <div>
        <a
          href='https://wxt.dev'
          target='_blank' rel="noreferrer"
        >
          <img
            src={wxtLogo}
            className='logo'
            alt='WXT logo'
          />
        </a>
        <a
          href='https://react.dev'
          target='_blank' rel="noreferrer"
        >
          <img
            src={reactLogo}
            className='logo react'
            alt='React logo'
          />
        </a>
      </div>
      <h1>WXT + React</h1>
      <div className='card'>
        <button onClick={handleOpenOptionsPage}>count is {count}</button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className='read-the-docs'>
        Click on the WXT and React logos to learn more
      </p>
    </>
  )
}

export default App