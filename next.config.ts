import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  eslint: {
    // ビルド時にESLintエラーを無視
    ignoreDuringBuilds: true,
  },
  // 既存の設定がある場合はここに残す
}

export default nextConfig