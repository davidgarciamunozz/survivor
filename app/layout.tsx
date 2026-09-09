import type { Metadata, Viewport } from "next";
import { LocaleProvider } from "@/lib/i18n-context";
import "./globals.css";

export const metadata: Metadata = {
  title: "Survivor Case — A power and communication kit for any emergency",
  description:
    "An integrated power bank case with a dedicated, always-reserved emergency system: main battery, reserved cells and a distress alarm switch.",
  openGraph: {
    title: "Survivor Case",
    description: "A power and communication kit for any emergency.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        {/* The still is only the hero below 820px; wider screens get the 3D
            model instead and must not pay for this download. */}
        <link
          rel="preload"
          as="image"
          href="/frames/hd/001.webp"
          media="(max-width: 819px)"
        />
      </head>
      <body>
        <LocaleProvider>{children}</LocaleProvider>
      </body>
    </html>
  );
}
