import { Poppins } from 'next/font/google'
import './globals.css'
import Header from "../components/Header/Header"


const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700'], // pesos que vai usar
})

export const metadata = {
  title: 'Meu Site',
  description: 'Portfólio com Poppins',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={poppins.className}>
        <Header />
        {children}
      </body>
    </html>
  )
}
