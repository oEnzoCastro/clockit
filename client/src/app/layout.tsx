import { Poppins } from "next/font/google";
// @ts-ignore: allow side-effect CSS import without type declarations
import "./global.css";
import Header   from "../components/Header/Header";
import { AuthProvider } from "../contexts/AuthContext";
import type { Metadata } from 'next'

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: 'ClockIt',
  description: 'Sistema de controle de monitores',
  icons: {
    icon: [
      { url: '/favicon-light.ico', media: '(prefers-color-scheme: dark)' },
      { url: '/favicon-dark.ico', media: '(prefers-color-scheme: light)' },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={poppins.className}>
        <AuthProvider> {/* <-- envolve todo o front-end */}
          <div className="children">
            <Header />
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}