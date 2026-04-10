# デプロイチェックリスト（makesmomo.com）

この手順どおりに実施すれば、公開ミス（404）をかなり防げます。

---

## 0. 公開対象フォルダ（固定）

- 公開に使うのは **`C:\Users\Owner\Desktop\makes-momo-site`** のみ
- `makes-momo-eap` は本番サイトとしてアップロードしない

---

## 1. デプロイ前チェック（30秒）

- [ ] `makes-momo-site` 直下に `index.html` がある
- [ ] `styles.css` と `script.js` がある
- [ ] 追加した新規ページ（例: `thanks.html`）が存在する
- [ ] `index.html` の主要リンクが相対パスで正しい（例: `./chat.html`）

---

## 2. Netlify へのデプロイ手順（Drop）

1. Netlify で対象プロジェクト（`makesmomo.com`）を開く
2. 左メニュー `Deploys`
3. `Deploy manually`（またはドラッグ＆ドロップ）
4. **`makes-momo-site` フォルダ**を選択してアップロード
5. 完了後 `Open production deploy` を開く

---

## 3. 公開後チェック（1分）

- [ ] `https://makesmomo.com/` が表示される
- [ ] `https://www.makesmomo.com/` が表示される
- [ ] 主要導線が開ける
  - [ ] AIチャット
  - [ ] 予約ページ

---

## 4. もし 404 が出たら（最短復旧）

1. Netlify の `Deploys` で最新デプロイを開く
2. `Open production deploy` で `netlify.app` 側を確認
   - `netlify.app` は表示される / 独自ドメインだけ404  
     → `Domain management` の紐付け確認
   - `netlify.app` も404  
     → フォルダ誤り。`makes-momo-site` を再アップロード

---

## 5. 運用ルール（毎回）

- デプロイ前に「いま選んだフォルダは `makes-momo-site` か？」を必ず確認
- 作業後は `Open production deploy` と独自ドメインの両方を確認

---

最終更新: 2026-03-24
