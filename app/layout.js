import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

// Display face for headings — distinct from the body/mono system so large
// statement type (hero + section headings) reads as a deliberate brand mark.
const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata = {
  title: "NEXUS AI CORE — Intelligence, Engineered",
  description:
    "A new architecture built to process intelligence at unprecedented scale. Meet NEXUS AI CORE.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} h-full bg-nexus-black antialiased`}
    >
      <body className="min-h-full flex flex-col bg-nexus-black text-nexus-white">
        {children}
      </body>
    </html>
  );
}
