import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.scss";
import { Header } from "./components/Header/Header";
import Head from "next/head";
import { Provider } from "./store/Provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SecureCloud",
  description:
    "SecureCloud offers a cutting-edge cloud storage platform prioritizing security, anonymity, and confidentiality. With state-of-the-art encryption protocols, we ensure unmatched data security against unauthorized access or breaches. Our registration process requires no personally identifiable information, ensuring total anonymity for users. We strictly adhere to a no-sharing policy, guaranteeing absolute confidentiality for your files. Embracing cryptocurrency payments, we offer secure, private transactions free from centralized control. With an intuitive interface and user-friendly features, SecureCloud provides effortless data storage, access, and management. Experience the future of privacy-centric cloud storage with SecureCloud – where your privacy is non-negotiable and guaranteed.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider>
          <Header />
          {children}
        </Provider>
      </body>
    </html>
  );
}
