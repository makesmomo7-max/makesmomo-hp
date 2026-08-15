# デプロイチェックリスト（eap.makesmomo.com）

この手順どおりに実施すれば、公開ミス（404）をかなり防げます。

---

## 0. 公開対象フォルダ（固定）

- 公開HPの正本は **`C:\Users\Owner\Desktop\makesmomo-hp`**
- 公開ドメインは **`hoken.makesmomo.com`**（はたらく健康相談室 LP）
- コーポレートサイトは **`C:\Users\Owner\Desktop\makes-momo-HP`** → `www.makesmomo.com`
- `makes-momo-site` は旧LP/旧Netlify試作。新規更新しない
- `makes-momo-eap` はEAPアプリ本体。公開HPとして混ぜない

---

## 1. デプロイ前チェック（30秒）

- [ ] `makesmomo-hp` 直下に `index.html` がある
- [ ] `styles.css` と `script.js` がある
- [ ] 追加した新規ページ（例: `thanks.html`）が存在する
- [ ] `index.html` の主要リンクが相対パスで正しい（例: `./chat.html`）
- [ ] `git status` で意図しない差分がない

---

## 2. Vercel へのデプロイ手順

1. `makesmomo-hp` で変更を確認
2. 必要に応じて commit / push
3. Vercel プロジェクト `makesmomo-hp` の Production を確認
4. `https://eap.makesmomo.com/` と `https://makesmomo-hp.vercel.app/` を開く

### DNS（お名前.com 等）

```
hoken  A  76.76.21.21
```

Vercel Domains で `hoken.makesmomo.com` を追加済み。`makesmomo.com` / `www.makesmomo.com` はコーポレートサイト側（`makesmomo-corporate`）のプロジェクトに付け替える。

---

## 3. 公開後チェック（1分）

- [ ] `https://hoken.makesmomo.com/` が表示される
- [ ] 主要導線が開ける
  - [ ] 予約ページ
  - [ ] 料金ページ
  - [ ] 従業員向け案内

---

## 4. もし 404 が出たら（最短復旧）

1. Vercel の `makesmomo-hp` 最新 Production Deploy を開く
2. `makesmomo-hp.vercel.app` 側を確認
   - `vercel.app` は表示される / 独自ドメインだけ404  
     → Domain 設定を確認
   - `vercel.app` も404  
     → デプロイ対象・ルートファイルを確認

---

## 5. 運用ルール（毎回）

- デプロイ前に「いま編集している正本は `makesmomo-hp` か？」を必ず確認
- `makes-momo-site` は旧URL転送・参照用。新規編集しない
- 作業後は Vercel Production URL と独自ドメインの両方を確認

---

最終更新: 2026-05-25
