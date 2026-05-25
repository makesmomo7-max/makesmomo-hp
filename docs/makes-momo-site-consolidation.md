# makes-momo-site 一本化メモ

最終更新: 2026-05-25

## 結論

`makes-momo-site` は `makesmomo-hp` に一本化する。

- 公開HP・営業LPの正本: `makesmomo-hp`
- EAPアプリ本体の正本: `makes-momo-eap`
- 旧 `makes-momo-site`: 旧LP / 旧Netlify試作 / 転送用

## 確認結果

| 項目 | 結果 |
|------|------|
| `makes-momo-site` | Git管理なし。旧LP、旧Netlify設定、チャット試作を含む |
| `makesmomo-hp` | Git管理あり。Vercel project `makesmomo-hp`。公開HPの現行正本 |
| `makes-momo-eap` | Git管理あり。EAPアプリ本体、API、PWA、資料群 |
| `yoyaku.html` | `makes-momo-site` と `makesmomo-hp` で同一内容 |
| `chat.html` | `makes-momo-site` と `makesmomo-hp` で同一内容 |
| `index.html` / `styles.css` | `makesmomo-hp` 側が新しく、EAP・巡回相談の現行LPとして優先 |

## 移行方針

1. `makesmomo-hp` を正本として README / デプロイ手順を更新する。
2. 旧 `makes-momo-site` は新規編集しない。
3. 旧URLや旧Vercel projectが残る場合は、`www.makesmomo.com` へリダイレクトする。
4. `makes-momo-eap` は混ぜず、EAPアプリ本体として分離する。

## 旧サイトから引き継ぐもの

- 予約ページ: 既に `makesmomo-hp/yoyaku.html` に同一内容あり
- チャット試作: 既に `makesmomo-hp/chat.html` に同一内容あり。ただし公開HPの主導線にはしない
- LP文言: 現行 `makesmomo-hp/index.html` の方が新しいため、旧 `makes-momo-site/index.html` は正本化しない

## 今後の運用

公開HPを更新する時は `C:\Users\Owner\Desktop\makesmomo-hp` のみ編集する。

EAPアプリ本体を更新する時は `C:\Users\Owner\Desktop\makes-momo-eap` を編集する。
