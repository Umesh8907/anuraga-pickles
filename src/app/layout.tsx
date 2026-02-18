import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers";
import { Toaster } from "sonner";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
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
        className={`${poppins.variable} antialiased`}
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
