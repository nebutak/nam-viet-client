import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { persistor, store } from './stores/index.jsx'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { SocketProvider } from './contexts/socket-context.jsx'
import { BrowserRouter as Router } from 'react-router-dom'
import { ThemeProvider } from './components/ThemeProvider.jsx'
import NetworkStatus from './components/custom/NetworkStatus.jsx'
import { Toaster } from 'sonner'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <SocketProvider>
        <PersistGate loading={null} persistor={persistor}>
          <ThemeProvider defaultTheme="light" storageKey="nam-viet-theme">
            <Router>
              <App />
            </Router>

            <NetworkStatus />
            <Toaster
              closeButton
              expand={true}
              richColors
              position="top-right"
            />
          </ThemeProvider>
        </PersistGate>
      </SocketProvider>
    </Provider>
  </StrictMode>,
)
