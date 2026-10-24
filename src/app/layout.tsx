import type { Metadata, Viewport } from "next";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://knowledge.yaqiin.org"),
  title: {
    default: "يقين للمعرفة - مكتبة، معالم، وأدوات للمسلم",
    template: "%s | يقين للمعرفة",
  },
  description: "كتب إسلامية للتحميل مجاناً، تعريف بالمعالم الإسلامية، وأدوات مفيدة للمسلم ولطالب العلم.",
  icons: { icon: "/favicon.svg" },
  openGraph: { siteName: "يقين للمعرفة", locale: "ar_DZ", type: "website" },
};

export const viewport: Viewport = {
  themeColor: "#064e3b",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preload" href="/fonts/thmanyahsans-Regular.woff2" as="font" type="font/woff2" crossOrigin="" />
        <link rel="preload" href="/fonts/thmanyahserifdisplay-Bold.woff2" as="font" type="font/woff2" crossOrigin="" />
      </head>
      <body className="flex min-h-screen flex-col font-sans">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
