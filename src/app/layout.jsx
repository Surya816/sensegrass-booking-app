import './globals.css'
import { Inter } from 'next/font/google'
import Providers from './providers'
import { ensureAdminExists } from '@/lib/ensureAdminExists';
import 'ol/ol.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Sensegrass App',
  description: 'Full Stack Booking Platform',
}

export default async function RootLayout({ children }) {
  await ensureAdminExists();
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
