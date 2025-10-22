import type { Metadata } from 'next'
import { Inter, Noto_Serif_JP } from 'next/font/google'
import './globals.css'
import { Navigation } from '@/components/layout/navigation'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const notoSerifJP = Noto_Serif_JP({ 
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-noto-serif-jp'
})

export const metadata: Metadata = {
  title: '百人一首クイズ - 楽しく学ぶ古典文学',
  description: '百人一首を楽しく学べるクイズアプリ。上の句から下の句を当てたり、作者を当てたり、様々なモードで学習できます。',
  keywords: ['百人一首', 'クイズ', '古典文学', '日本文化', '学習'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className={`${inter.variable} ${notoSerifJP.variable} font-sans antialiased`}>
        <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-purple-50">
          <Navigation />
          <main className="container mx-auto px-4 py-8">
            {children}
          </main>
          <footer className="border-t mt-16 py-6 text-center text-sm text-muted-foreground">
            <p>© 2025 百人一首クイズ. All rights reserved.</p>
          </footer>
        </div>
      </body>
    </html>
  )
}