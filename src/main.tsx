import { createRoot } from 'react-dom/client'
import './assets/styles/index.css'

import App from './App'
import { Toaster } from './components/ui/sonner'
import { ThemeProvider } from './components/shared/Theme-provider'

createRoot(document.getElementById('root')!).render(
     <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <App/>
        <Toaster position="bottom-right" richColors closeButton />
     </ThemeProvider>
)
