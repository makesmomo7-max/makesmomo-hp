# makesmomo-hp

MakesMOMO の公開ホームページ / 営業LPです。

`makes-momo-site` にあった旧LP・予約ページ・チャット試作は、この `makesmomo-hp` に一本化しました。今後、公開HPとして更新する正本はこのリポジトリです。

## ファイル構成

- `index.html` … メインのページ本体
- `yoyaku.html` … 企業の人事・総務担当者様向け相談予約フォーム
- `chat.html` … AIサポートチャット試作（Vercel API `/api/chat` 経由）
- `api/chat.js` … チャット用サーバーレス関数（APIキーは環境変数のみ）
- `ryokin.html` … 料金表
- `eap-leaflet.html` … 従業員向け案内
- `b2b-leaflet.html` … 法人向け資料
- `styles.css` … デザイン用スタイルシート（レスポンシブ対応）
- `script.js` … ナビゲーション開閉やスクロールなどの軽い動作
- `package.json` … 簡易的な開発用設定

## 一本化方針

- 公開HP・営業LP: `makesmomo-hp`
- EAPアプリ本体: `makes-momo-eap`
- 旧フォルダ `makes-momo-site`: 旧LP/旧Netlify試作。必要要素は `makesmomo-hp` に吸収済み。旧URLは `makesmomo-hp` 側へ転送する。

`makes-momo-site` の `yoyaku.html` と `chat.html` は、このリポジトリ内の同名ファイルへ吸収済みです。旧 `index.html` / `styles.css` は、現行HPの方が新しいため正本にしません。

## AIチャット

Vercel の環境変数 `ANTHROPIC_API_KEY` を設定すると `/api/chat` から Claude API を呼び出します。

未設定の場合も画面は壊れず、「AIチャット準備中」として予約フォームへ誘導します。

## デプロイ

Vercel プロジェクト: `makesmomo-hp`

主な公開URL:

- `https://www.makesmomo.com/`
- `https://makesmomo-hp.vercel.app/`

## プレビュー方法

Node.js が入っている場合は、PowerShell もしくはターミナルでこのフォルダに移動して、次のコマンドでもプレビューできます。

```bash
npm start
```

`http://localhost:3000` など、表示された URL をブラウザで開いてください。

