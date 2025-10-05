import './globals.css'
import { Inter } from 'next/font/google'
import RegisterServiceWorker from './register-sw'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'FoundIt - Campus Lost & Found',
  description: 'Digital lost and found system for campus communities',
  manifest: '/manifest.json',
  themeColor: '#3686C7',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'FoundIt',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: 'cover',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="FoundIt" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className={inter.className}>
        <RegisterServiceWorker />
        {children}
      </body>
    </html>
  )
}

