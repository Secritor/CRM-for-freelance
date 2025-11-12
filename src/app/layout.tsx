'use client'

import './globals.css'
import { Sidebar } from '@/app/components/Sidebar'
import { Roboto } from 'next/font/google'

import { Provider } from 'react-redux'
import { store } from '@/store/store'

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <Provider store={store}>
          <div style={{ display: 'flex' }}>
            <Sidebar />
            <main style={{ flexGrow: 1, padding: '1rem' }}>{children}</main>
          </div>
        </Provider>
      </body>
    </html>
  )
}
