import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ThemeProviderWrapper from './Shell/Theme.jsx'
import { store } from './redux/store.js'
import { Provider } from 'react-redux'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProviderWrapper>
      <Provider store={store}>
        <App />
      </Provider>

    </ThemeProviderWrapper>
  </StrictMode>,
)
