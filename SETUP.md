# 買い物管理アプリ セットアップ手順

## ローカル開発

### 1. 依存パッケージのインストール
```bash
npm install
```

### 2. 環境変数の設定
`.env.example` をコピーして `.env` を作成し、DATABASE_URL を設定してください。

```bash
cp .env.example .env
```

#### 無料DBの取得方法（Neon推奨）
1. https://neon.tech にアクセスしてアカウント作成
2. 新しいProjectを作成
3. 「Connection string」をコピーして `.env` の `DATABASE_URL` に貼り付け

### 3. データベースのセットアップ
```bash
npm run db:push
```

### 4. 開発サーバーの起動
```bash
npm run dev
```
http://localhost:3000 でアクセス可能

---

## Vercelへのデプロイ

### 1. GitHubリポジトリの作成
```bash
git init
git add .
git commit -m "initial commit"
git remote add origin https://github.com/ユーザー名/kaimono.git
git push -u origin main
```

### 2. Vercelと連携
1. https://vercel.com にアクセス・ログイン
2. 「New Project」→ GitHubリポジトリを選択してインポート
3. 「Environment Variables」に `DATABASE_URL` を追加
4. 「Deploy」ボタンを押す

### 3. デプロイ後のDB初期化
Vercelのダッシュボードから「Functions」タブ、または以下のコマンドを実行:
```bash
npx vercel env pull .env.local
npm run db:push
```

---

## 画面構成

| 画面 | URL | 説明 |
|------|-----|------|
| ログイン | `/` | ユーザー選択 |
| ホーム | `/home` | メニュー画面 |
| 買い物リスト | `/list` | 一覧・削除 |
| リクエスト | `/request` | 新規登録 |
