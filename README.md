# 百人一首クイズアプリ

Next.js + TypeScriptで作成された百人一首学習アプリケーション

## 🌸 特徴

- **4つのクイズモード**
  - 上の句 → 下の句
  - 下の句 → 上の句
  - 作者 → 歌
  - 歌 → 作者

- **3段階の難易度**
  - 初級（1-20番）
  - 中級（21-50番）
  - 上級（51-100番）

- **学習機能**
  - 進捗管理
  - 学習統計
  - 苦手な歌の特定
  - 今日の一首

- **ライブラリ機能**
  - 全百首の閲覧
  - 検索機能

## 🚀 セットアップ

### 前提条件

- Node.js 18以上
- npm または yarn

### インストール

```bash
# リポジトリをクローン
git clone <repository-url>
cd hyakunin-isshu-next

# 依存パッケージをインストール
npm install

# 開発サーバーを起動
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開きます。

## 📁 プロジェクト構造

```
hyakunin-isshu-next/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # ルートレイアウト
│   ├── page.tsx           # ホームページ
│   ├── quiz/              # クイズページ
│   │   └── page.tsx
│   └── library/           # ライブラリページ
│       └── page.tsx
├── components/            # Reactコンポーネント
│   ├── ui/               # 基本UIコンポーネント
│   ├── layout/           # レイアウトコンポーネント
│   └── quiz/             # クイズ関連コンポーネント
├── lib/                  # ライブラリとユーティリティ
│   ├── types.ts          # 型定義
│   ├── utils.ts          # ユーティリティ関数
│   ├── data-loader.ts    # データ読み込み
│   └── quiz-manager.ts   # クイズロジック
├── store/                # 状態管理（Zustand）
│   └── quiz-store.ts
└── public/               # 静的ファイル
    └── data/
        └── hyakunin_isshu.json  # 百人一首データ
```

## 🛠️ 技術スタック

- **フレームワーク**: Next.js 14 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **UIコンポーネント**: shadcn/ui + Radix UI
- **状態管理**: Zustand
- **アイコン**: Lucide React
- **フォント**: Inter + Noto Serif JP

## 📝 データファイル

`public/data/hyakunin_isshu.json` に百人一首のデータを配置してください。

データ形式：
```json
[
  {
    "id": 1,
    "author": "天智天皇",
    "upper": "秋の田の　かりほの庵の　苫をあらみ",
    "lower": "わが衣手は　露にぬれつつ",
    "reading_upper": "あきのたの　かりほのいほの　とまをあらみ",
    "reading_lower": "わがころもでは　つゆにぬれつつ",
    "description": "秋の田の..."
  }
]
```

## 🚢 デプロイ

### Vercelへのデプロイ

```bash
# Vercel CLIをインストール
npm i -g vercel

# デプロイ
vercel
```

または、GitHubと連携して自動デプロイ：
1. GitHubリポジトリにプッシュ
2. [Vercel](https://vercel.com)でリポジトリをインポート
3. 自動ビルド・デプロイ

## 📄 ライセンス

MIT License

## 🤝 コントリビューション

プルリクエストを歓迎します！

---

Created with ❤️ by [Your Name]