import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter, Routes, Route, Outlet } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from '@/store/store'
import AppShell from '@/app/components/AppShell'

import '@/app/globals.css'

import Home from '@/app/page'
import Clients from '@/app/clients/page'
import Deals from '@/app/deals/page'
import CalendarPage from '@/app/calendar/page'
import Analytics from '@/app/analytics/page'

function App() {
  return (
    <Provider store={store}>
      <HashRouter>
        <Routes>
          <Route element={<AppShell />}>
            <Route index element={<Home />} />
            <Route path="clients" element={<Clients />} />
            <Route path="deals" element={<Deals />} />
            <Route path="calendar" element={<CalendarPage />} />
            <Route path="analytics" element={<Analytics />} />
          </Route>
        </Routes>
      </HashRouter>
    </Provider>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
