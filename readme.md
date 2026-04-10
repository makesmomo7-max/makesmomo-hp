# 医療・心理・就労支援サービス LP（仮）

医療・心理・就労支援に関するサービス紹介用の、シンプルな 1 ページのランディングページです。

## ファイル構成

- `index.html` … メインのページ本体
- `chat.html` … AI サポートチャット（Netlify Function 経由で Claude API を呼び出し）
- `netlify/functions/chat.js` … チャット用サーバーレス関数（API キーは環境変数のみ）
- `netlify.toml` … Netlify の公開ディレクトリ・Functions パス設定
- `styles.css` … デザイン用スタイルシート（レスポンシブ対応）
- `script.js` … ナビゲーション開閉やスクロールなどの軽い動作
- `package.json` … 簡易的な開発用設定

## AI チャット（Netlify + Claude）

1. Netlify のサイト設定で環境変数 **`ANTHROPIC_API_KEY`** を登録してください（Claude の API キー）。
2. デプロイ後、`chat.html` から `/.netlify/functions/chat` が呼ばれます。
3. ローカルで Functions まで含めて試す場合は [Netlify CLI](https://docs.netlify.com/cli/get-started/) の `netlify dev` を利用してください（`file://` や `npm start` の静的サーバーだけでは Function は動きません）。

## プレビュー方法

### 1. ブラウザで直接開く（いちばん簡単）

1. エクスプローラーでこのフォルダを開く
2. `index.html` をダブルクリック
3. お使いのブラウザでページが表示されます

### 2. （任意）ローカルサーバーで動かす

Node.js が入っている場合は、PowerShell もしくはターミナルでこのフォルダに移動して、次のコマンドでもプレビューできます。

```bash
npm start
```

`http://localhost:3000` など、表示された URL をブラウザで開いてください。

---

文言や構成はすべて仮です。実際のサービス内容・料金・運用方法が決まり次第、テキストを書き換えてご利用ください。

