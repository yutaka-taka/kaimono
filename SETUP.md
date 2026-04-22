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

---

## 長期運用メモ（AIツールなしで維持するために）

### このアプリの仕組みまとめ
- **フロント:** Vercel（無料）にデプロイ。GitHubにpushすると自動でビルド・公開される
- **DB:** Neon（無料）のPostgreSQLに買い物データを保存
- **AIは一切使っていない** ので、Claude等の契約状態はアプリ動作に無関係

### よくあるトラブルと対処

#### アプリが開けない・エラー画面が出る
1. https://vercel.com でデプロイが成功しているか確認
2. 失敗していたら「Redeploy」ボタンを押す

#### データが保存・表示されない
1. https://neon.tech でDBが起動しているか確認（無料枠は長期未使用でサスペンドされることがある）
2. DBダッシュボードで「Resume」を押して再起動

#### コードを修正してデプロイする手順
```bash
# ファイルを編集した後
git add .
git commit -m "修正内容を書く"
git push origin main
# → Vercelが自動でビルドして本番反映される
```

#### 万が一サービスが有料化・終了した場合の代替先
- **Vercelの代替:** Railway (https://railway.app) や Render (https://render.com) ← 共に無料枠あり
- **Neonの代替:** Supabase (https://supabase.com) や Turso ← 共に無料枠あり
- 移行時は `DATABASE_URL` を新しい接続文字列に差し替えて `npm run db:push` を実行するだけ
