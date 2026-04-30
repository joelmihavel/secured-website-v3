import type { Metadata } from "next";
import localFont from "next/font/local";
import { Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { ConditionalNavbar } from "@/components/layout/ConditionalNavbar";
import { ConditionalFooter } from "@/components/layout/ConditionalFooter";

// Trigger Vercel deploy
const zin = localFont({
  src: "../../font/ZinDisplayCondensed.otf",
  variable: "--font-zin",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const title = "Flent | India's New Standard of Renting";
const description =
  "Unlock India's top 1% rental homes with Flent. Fully furnished, designer homes with no broker hassles and minimal security deposit. Just bring your clothes, and you're home.";

export const metadata: Metadata = {
  metadataBase: new URL("https://flent.in"),
  title,
  description,
  openGraph: {
    title,
    description,
    images: "/images/og-image.jpg",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: "/images/og-image.jpg",
  },
};

import { BreadcrumbProvider } from "@/context/BreadcrumbContext";
import { ScrollRestoration } from "@/components/utils/ScrollRestoration";
import { CSPostHogProvider } from "./providers";
import { GoogleMapsProvider } from "./GoogleMapsProvider";

// ... existing imports

import { TopBanner } from "@/components/layout/TopBanner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const whatsappNumber = (process.env.WHATSAPP_NUMBER || "").replace(/\D/g, "");

  return (
    <html lang="en">
      <body
        className={`${zin.variable} ${plusJakartaSans.variable} antialiased font-body bg-bg-white overscroll-none`}
      >
        <TopBanner />
        {/* HubSpot Tracking Code */}
        <Script
          type="text/javascript"
          id="hs-script-loader"
          src="//js-na2.hs-scripts.com/45469632.js"
          strategy="afterInteractive"
        />

        {/* Google Tag Manager */}
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-NN5V7MMT');
          `}
        </Script>

        {/* Google Tag (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-16885482628"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-16885482628');
          `}
        </Script>

        {/* Whatsapp Conversion Pixel */}
        <Script id="whatsapp-conversion" strategy="afterInteractive">
          {`
            function gtag_report_conversion(url) {
              var callback = function () {
                if (typeof(url) != 'undefined') {
                  window.location = url;
                }
              };
              gtag('event', 'conversion', {
                  'send_to': 'AW-16885482628/LlGRCKmzrsgaEISJ0PM-',
                  'event_callback': callback
              });
              return false;
            }
          `}
        </Script>

        <Script id="whatsapp-runtime-config" strategy="beforeInteractive">
          {`window.__FLENT_WHATSAPP_NUMBER__ = "${whatsappNumber}";`}
        </Script>

        {/* WAX Attribution Tracking Script */}
        <Script
          id="wax-attribution-tracking"
          src="/scripts/wax-attribution.js"
          strategy="afterInteractive"
        />

        <CSPostHogProvider>
          <GoogleMapsProvider>
            <BreadcrumbProvider>
              <ScrollRestoration />
              <ConditionalNavbar />
              {children}
              <ConditionalFooter />
            </BreadcrumbProvider>
          </GoogleMapsProvider>
        </CSPostHogProvider>
      </body>
    </html>
  );
}
