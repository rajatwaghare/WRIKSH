import { EB_Garamond, Sahitya } from "next/font/google";
import "./globals.css";
import SmoothScroll from "./components/SmoothScroll";


const ebGaramond = EB_Garamond({
  variable: "--font-eb-garamond",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const sahitya = Sahitya({
  variable: "--font-sahitya",
  subsets: ["devanagari"],   // ← covers Hindi & Marathi
  weight: ["400", "700"],
});

export const metadata = {
  title: "Wriksh - Beauty Awaknes The Soul To Act.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${ebGaramond.variable} ${sahitya.variable} antialiased`}>
      <body className="flex flex-col">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}