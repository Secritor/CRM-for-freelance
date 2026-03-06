'use client'

import { useSelector } from 'react-redux'
import type { RootState } from '@/store/store'
import { Sidebar } from './Sidebar'
import LoginPage from './LoginPage'
import { Toaster } from 'react-hot-toast'

interface AppShellProps {
  children: React.ReactNode
}

export default function AppShell({ children }: AppShellProps) {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated)

  if (!isAuthenticated) {
    return (
      <>
        <Toaster position="top-right" />
        <LoginPage />
      </>
    )
  }

  return (
    <>
      <Toaster position="top-right" />
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <Sidebar />
        <main style={{ flexGrow: 1, padding: '1rem', minWidth: 0 }}>{children}</main>
      </div>
    </>
  )
}
