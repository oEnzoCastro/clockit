import { Poppins } from "next/font/google";
import "./globals.css";
import Header from "../components/Header/Header";
import Background from "@/components/Background/Background";
import { AuthProvider } from "../contexts/AuthContext"; // <-- import do AuthProvider

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata = {
  title: "ClockIt",
  description: "Portfólio com Poppins",
};

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
          <Background />
        </AuthProvider>
      </body>
    </html>
  );
}