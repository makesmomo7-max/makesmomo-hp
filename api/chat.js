const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";
const MODEL = process.env.ANTHROPIC_MODEL || "claude-3-5-haiku-latest";

const SYSTEM_PROMPT = `あなたはmakes-momoのサポートAIです。
企業の人事・総務担当者からの導入相談に丁寧に答えてください。
メンタルヘルス・ストレスチェック・EAPサービスの導入について案内し、
具体的な相談は予約フォームへ誘導してください。
医療的な診断や治療判断は行わず、緊急性がある場合は地域の緊急窓口や医療機関への相談を促してください。`;

function setCors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Content-Type", "application/json; charset=utf-8");
}

function fallbackReply() {
  return [
    "ありがとうございます。現在AIチャットの自動応答は準備中です。",
    "EAP・巡回健康相談・ストレスチェック導入については、予約フォームからご相談ください。",
    "内容を確認のうえ、担当者よりご案内いたします。"
  ].join("\n");
}

export default async function handler(req, res) {
  setCors(res);

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    res.status(200).json({ content: fallbackReply(), degraded: true });
    return;
  }

  const rawMessages = Array.isArray(req.body?.messages) ? req.body.messages : [];
  const messages = rawMessages
    .filter(
      (m) =>
        m &&
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string"
    )
    .slice(-12)
    .map((m) => ({
      role: m.role,
      content: m.content.slice(0, 4000),
    }));

  if (messages.length === 0) {
    res.status(400).json({ error: "messages (non-empty array) is required" });
    return;
  }

  try {
    const anthropicRes = await fetch(ANTHROPIC_URL, {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 1200,
        system: SYSTEM_PROMPT,
        messages,
      }),
    });

    const data = await anthropicRes.json();

    if (!anthropicRes.ok) {
      const msg =
        data?.error?.message ||
        data?.error?.type ||
        `Anthropic API error (${anthropicRes.status})`;
      res
        .status(anthropicRes.status >= 500 ? 502 : anthropicRes.status)
        .json({ error: msg });
      return;
    }

    const text =
      data?.content?.[0]?.type === "text"
        ? data.content[0].text
        : data?.content?.[0]?.text || "";

    res.status(200).json({ content: text || fallbackReply() });
  } catch (err) {
    console.error("chat function error:", err);
    res.status(502).json({ error: "Upstream request failed" });
  }
}
