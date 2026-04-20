/**
 * EAP Webアプリのスクリーンショットを撮影してHP用画像として保存する。
 *
 * 使い方:
 *   node tools/capture_eap_screens.mjs
 *
 * 前提:
 *   - 同じデスクトップに `makes-momo-eap` フォルダがある
 *   - puppeteer がインストールされている
 *
 * 出力先:
 *   ./images/app-home.png
 *   ./images/app-chat.png
 *   ./images/app-booking.png
 *   ./images/app-check.png
 */

import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const HP_ROOT = path.resolve(__dirname, "..");
const EAP_ROOT = path.resolve(HP_ROOT, "..", "makes-momo-eap");
const OUT_DIR = path.join(HP_ROOT, "images");
const PORT = 4178;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".mjs": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
};

function startStaticServer(rootDir, port) {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      try {
        const urlPath = decodeURIComponent((req.url || "/").split("?")[0]);
        let filePath = path.join(rootDir, urlPath === "/" ? "/eap.html" : urlPath);
        if (!filePath.startsWith(rootDir)) {
          res.writeHead(403);
          return res.end("forbidden");
        }
        if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
          filePath = path.join(filePath, "index.html");
        }
        if (!fs.existsSync(filePath)) {
          res.writeHead(404);
          return res.end("not found: " + urlPath);
        }
        const ext = path.extname(filePath).toLowerCase();
        res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
        fs.createReadStream(filePath).pipe(res);
      } catch (e) {
        res.writeHead(500);
        res.end(String(e));
      }
    });
    server.listen(port, "127.0.0.1", () => resolve(server));
  });
}

const TARGETS = [
  { name: "app-home",    url: `http://127.0.0.1:${PORT}/eap.html?tenant=demo&full=1`,    waitMs: 1500 },
  { name: "app-chat",    url: `http://127.0.0.1:${PORT}/chat.html?tenant=demo`,           waitMs: 1500 },
  { name: "app-booking", url: `http://127.0.0.1:${PORT}/yoyaku_employee.html?tenant=demo`, waitMs: 2000 },
  { name: "app-check",   url: `http://127.0.0.1:${PORT}/check.html?tenant=demo&mode=quick`, waitMs: 1500 },
];

async function main() {
  if (!fs.existsSync(EAP_ROOT)) {
    console.error(`EAPフォルダが見つかりません: ${EAP_ROOT}`);
    process.exit(1);
  }
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  console.log(`[server] starting at http://127.0.0.1:${PORT} (root=${EAP_ROOT})`);
  const server = await startStaticServer(EAP_ROOT, PORT);

  console.log("[puppeteer] launching browser...");
  const browser = await puppeteer.launch({
    headless: "new",
    defaultViewport: null,
  });

  try {
    for (const t of TARGETS) {
      console.log(`[capture] ${t.name} <- ${t.url}`);
      const page = await browser.newPage();
      // iPhone 14 Pro 相当
      await page.setViewport({
        width: 393,
        height: 852,
        deviceScaleFactor: 2,
        isMobile: true,
        hasTouch: true,
      });
      await page.setUserAgent(
        "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1"
      );

      try {
        await page.goto(t.url, { waitUntil: "networkidle2", timeout: 15000 });
      } catch (e) {
        console.warn(`[warn] networkidle wait timed out for ${t.name}, continuing`);
      }
      await new Promise((r) => setTimeout(r, t.waitMs));

      const outPath = path.join(OUT_DIR, `${t.name}.png`);
      await page.screenshot({ path: outPath, type: "png", fullPage: false });
      console.log(`[saved] ${outPath}`);
      await page.close();
    }
  } finally {
    await browser.close();
    server.close();
    console.log("[done]");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
