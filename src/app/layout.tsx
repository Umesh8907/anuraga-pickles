import type { Metadata } from "next";
import { Geist, Geist_Mono, Poppins, Cinzel, Caveat_Brush } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  adjustFontFallback: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  adjustFontFallback: true,
});

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
  adjustFontFallback: true,
});

const cinzel = Cinzel({
  weight: ['400', '500', '600', '700'],
  subsets: ["latin"],
  variable: "--font-cinzel",
  display: "swap",
  adjustFontFallback: true,
});

const caveat = Caveat_Brush({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-caveat",
  display: "swap",
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: {
    default: "Anuraga Pickles | Authentic South Indian Delicacies",
    template: "%s | Anuraga Pickles",
  },
  description: "Handcrafted organic pickles and spices from Andhra using traditional recipes. Authentic taste, premium quality ingredients, and no preservatives.",
  keywords: ["pickles", "andhra pickles", "organic pickles", "indian spices", "homemade pickles", "telugu pickles", "mango pickle", "gongura"],
  authors: [{ name: "Anuraga Pickles" }],
  creator: "Anuraga Pickles",
  publisher: "Anuraga Pickles",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Anuraga Pickles",
    title: "Anuraga Pickles | Authentic South Indian Delicacies",
    description: "Handcrafted organic pickles and spices from Andhra using traditional recipes.",
    images: [
      {
        url: "/og-image.jpg", // We should ensure this exists or use a placeholder
        width: 1200,
        height: 630,
        alt: "Anuraga Pickles - Authentic South Indian Flavors",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Anuraga Pickles | Authentic South Indian Delicacies",
    description: "Handcrafted organic pickles and spices from Andhra using traditional recipes.",
    images: ["/og-image.jpg"],
    creator: "@anuragapickles",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} ${cinzel.variable} ${caveat.variable} antialiased`}
        suppressHydrationWarning
      >
        <Providers>
          {children}
          <Toaster position="top-right" richColors />
        </Providers>
      </body>
    </html>
  );
}
