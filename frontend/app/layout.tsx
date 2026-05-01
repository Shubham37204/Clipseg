import type { Metadata } from "next"
import "./globals.css" // optional but recommended

export const metadata: Metadata = {
  title: "CLIPSeg",
  description: "Image segmentation with text prompts",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 min-h-screen">
        <main className="max-w-4xl mx-auto p-6">
          {children}
        </main>
      </body>
    </html>
  )
}
