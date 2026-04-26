import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import puppeteer from "puppeteer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const htmlPath = path.resolve(__dirname, "career_support_worksheets_A4_duplex.html");
const defaultOutPath = path.resolve(process.cwd(), "career_support_worksheets_A4_2sheets_duplex.pdf");

function parseArgs(argv) {
  const out = { outPath: defaultOutPath, pageRanges: undefined };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--out" && argv[i + 1]) {
      out.outPath = path.resolve(process.cwd(), argv[i + 1]);
      i++;
      continue;
    }
    if (a === "--pages" && argv[i + 1]) {
      out.pageRanges = String(argv[i + 1]);
      i++;
      continue;
    }
  }
  return out;
}

const { outPath, pageRanges } = parseArgs(process.argv.slice(2));

const browser = await puppeteer.launch({
  headless: true,
});

try {
  const page = await browser.newPage();
  await page.goto(pathToFileURL(htmlPath).toString(), { waitUntil: "networkidle0" });

  await page.pdf({
    path: outPath,
    format: "A4",
    printBackground: true,
    preferCSSPageSize: true,
    ...(pageRanges ? { pageRanges } : {}),
    margin: { top: "0mm", right: "0mm", bottom: "0mm", left: "0mm" },
  });

  // eslint-disable-next-line no-console
  console.log(`Wrote PDF: ${outPath}`);
} finally {
  await browser.close();
}

