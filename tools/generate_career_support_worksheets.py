from __future__ import annotations

import argparse
from dataclasses import dataclass
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.cidfonts import UnicodeCIDFont
from reportlab.pdfgen import canvas


@dataclass(frozen=True)
class Box:
    label: str
    hint: str | None = None
    height_mm: float = 26.0


WORK1_BOXES: list[Box] = [
    Box("自己紹介", "（名前・所属・役割）", 24.0),
    Box("支援の対象者", "（誰を・どんな状況の方を）", 28.0),
    Box("提供している支援内容", "（具体的に何をしているか）", 32.0),
    Box("支援のこだわり・強み", "（自分らしいアプローチ）", 30.0),
    Box("支援を通じて目指す変化", "（相談者にどうなってほしいか）", 30.0),
    Box("関心を持たせるフレーズ", "（「もっと聞きたい」と感じる一言）", 26.0),
    Box("クロージング", "（繋がりたいこと・一緒にしたいこと）", 24.0),
]


WORK1_EXAMPLES: dict[str, str] = {
    "自己紹介": "〇〇と申します。△△センターで就労支援員として働いています。",
    "支援の対象者": "就職活動に不安を感じている方やブランクのある方を中心に支援しています。",
    "提供している支援内容": "自己理解のワーク、履歴書・職務経歴書の作成支援、面接練習を行っています。",
    "支援のこだわり・強み": "相談者の「なりたい姿」を丁寧に引き出すことを大切にしています。",
    "支援を通じて目指す変化": "「自分でキャリアを選べる」という自信を持って就職できるようになってほしいです。",
    "関心を持たせるフレーズ": "「諦めかけていた方が3ヶ月後に自分らしい仕事に出会えた事例があります。」",
    "クロージング": "もし連携できそうなケースがあれば、ぜひご相談ください。",
}


ACTION_ITEMS: list[tuple[str, str]] = [
    ("Attention", "（相手を引き込むメッセージ）"),
    ("Change", "（支援による具体的な変化）"),
    ("Trust", "（信頼・実績・資格）"),
    ("Imagination", "（相談者の変化ストーリー）"),
    ("Only One", "（自分・自団体だけの強み）"),
    ("Network", "（連携・つながり・紹介）"),
]

WORK2_EXAMPLES: dict[str, str] = {
    "Attention": "「就職に自信がない方が3ヶ月で自分らしい仕事に出会えるよう支援しています。」",
    "Change": "自己理解が深まり、自分で納得してキャリアを選べるようになる。",
    "Trust": "国家資格キャリアコンサルタント。支援歴〇年、担当数〇名以上。",
    "Imagination": "「最初は自信がなかった〇〇さんが面接で自分の言葉で話せるようになりました。」",
    "Only One": "障害のある方の就職支援に特化。地域の医療・福祉機関と密な連携を持つ。",
    "Network": "ハローワーク・病院・特例子会社・福祉事業所と日常的に連携している。",
}

JP_FONT = "HeiseiKakuGo-W5"


def _wrap_text(
    text: str,
    font_name: str,
    font_size: float,
    max_width: float,
) -> list[str]:
    if not text:
        return []
    out: list[str] = []
    current = ""
    for ch in text:
        tentative = current + ch
        if pdfmetrics.stringWidth(tentative, font_name, font_size) <= max_width:
            current = tentative
            continue
        if current:
            out.append(current)
            current = ch
        else:
            out.append(tentative)
            current = ""
    if current:
        out.append(current)
    return out


def _draw_title(c: canvas.Canvas, title: str, subtitle: str | None, x: float, y: float) -> float:
    c.setFillColor(colors.black)
    c.setFont(JP_FONT, 15)
    c.drawString(x, y, title)
    if subtitle:
        c.setFont(JP_FONT, 10.5)
        c.setFillColor(colors.HexColor("#444444"))
        c.drawString(x, y - 14, subtitle)
        return y - 26
    return y - 18


def _draw_box(
    c: canvas.Canvas,
    x: float,
    y_top: float,
    w: float,
    h: float,
    label: str,
    hint: str | None,
    body_text: str | None,
    *,
    draw_lines: bool,
) -> float:
    # Outer border
    c.setStrokeColor(colors.HexColor("#222222"))
    c.setLineWidth(1)
    c.rect(x, y_top - h, w, h, stroke=1, fill=0)

    # Header band
    header_h = 10 * mm
    c.setFillColor(colors.HexColor("#F3F4F6"))
    c.rect(x, y_top - header_h, w, header_h, stroke=0, fill=1)
    c.setFillColor(colors.black)
    c.setFont(JP_FONT, 11)
    c.drawString(x + 4 * mm, y_top - 7.2 * mm, label)
    if hint:
        c.setFont(JP_FONT, 9.5)
        c.setFillColor(colors.HexColor("#555555"))
        c.drawString(x + 40 * mm, y_top - 7.2 * mm, hint)
        c.setFillColor(colors.black)

    # Body area
    body_top = y_top - header_h - 3 * mm
    body_left = x + 4 * mm
    body_right = x + w - 4 * mm
    body_width = body_right - body_left

    if draw_lines:
        c.setStrokeColor(colors.HexColor("#D1D5DB"))
        c.setLineWidth(0.7)
        line_gap = 7.0 * mm
        y_line = y_top - header_h - 8 * mm
        min_y = y_top - h + 6 * mm
        while y_line > min_y:
            c.line(body_left, y_line, body_right, y_line)
            y_line -= line_gap

    if body_text:
        c.setFillColor(colors.black)
        c.setFont(JP_FONT, 10.5)
        lines = _wrap_text(body_text, JP_FONT, 10.5, body_width)
        y_text = body_top - 1.5 * mm
        for ln in lines[:8]:
            c.drawString(body_left, y_text, ln)
            y_text -= 6.0 * mm

    return y_top - h - 6 * mm


def draw_work1(c: canvas.Canvas, *, with_example: bool) -> None:
    page_w, page_h = A4
    margin_x = 14 * mm
    y = page_h - 16 * mm

    y = _draw_title(
        c,
        "☆ ワーク① 自分の支援活動を1分間で伝えるシート",
        "書き込みやすいA4版（空白/記入例）",
        margin_x,
        y,
    )

    c.setFont(JP_FONT, 9.8)
    c.setFillColor(colors.HexColor("#111827"))
    note = "1. まずご自身で記入（目安10分）  2. ペアになり1分で伝える  3. 難しかったところを共有"
    c.drawString(margin_x, y, note)
    y -= 10 * mm

    box_w = page_w - margin_x * 2
    for b in WORK1_BOXES:
        body = WORK1_EXAMPLES.get(b.label) if with_example else None
        y = _draw_box(
            c,
            margin_x,
            y,
            box_w,
            b.height_mm * mm,
            b.label,
            b.hint,
            body,
            draw_lines=not with_example,
        )


def draw_work2(c: canvas.Canvas, *, with_example: bool) -> None:
    page_w, page_h = A4
    margin_x = 14 * mm
    y = page_h - 16 * mm

    y = _draw_title(
        c,
        "☆ ワーク② 支援者のためのACTIONフレームワーク",
        "エレベータートークで書き出した素材をもとに、ACTIONの枠を埋めてみましょう。",
        margin_x,
        y,
    )

    # Top keywords row (visual anchor)
    c.setFillColor(colors.HexColor("#111827"))
    c.setFont(JP_FONT, 11)
    keywords = ["Attention", "Network", "Only One", "Change", "Trust", "Imagination"]
    x = margin_x
    for kw in keywords:
        c.drawString(x, y, kw)
        x += (page_w - margin_x * 2) / 6
    y -= 11 * mm

    c.setFont(JP_FONT, 9.6)
    c.setFillColor(colors.HexColor("#374151"))
    c.drawString(margin_x, y, "コミュニケーション戦略")
    y -= 9 * mm

    box_w = page_w - margin_x * 2
    # Use even heights so it fills the page with comfortable writing space.
    per_h = 36.0 * mm if not with_example else 33.5 * mm
    for key, hint in ACTION_ITEMS:
        body = WORK2_EXAMPLES.get(key) if with_example else None
        y = _draw_box(
            c,
            margin_x,
            y,
            box_w,
            per_h,
            key,
            hint,
            body,
            draw_lines=not with_example,
        )


def build_pdf(out_path: Path) -> None:
    out_path.parent.mkdir(parents=True, exist_ok=True)

    # Register Japanese fonts that work without external TTF files.
    # "HeiseiKakuGo-W5" is a standard CID font in ReportLab.
    pdfmetrics.registerFont(UnicodeCIDFont(JP_FONT))

    c = canvas.Canvas(str(out_path), pagesize=A4)
    c.setAuthor("makesmomo-hp")
    c.setTitle("career_support_worksheets (A4 duplex)")

    # Page order for duplex printing (2 sheets, both sides): 1-2 (sheet1), 3-4 (sheet2)
    draw_work1(c, with_example=False)
    c.showPage()

    draw_work2(c, with_example=False)
    c.showPage()

    draw_work1(c, with_example=True)
    c.showPage()

    draw_work2(c, with_example=True)
    c.showPage()

    c.save()


def main() -> int:
    parser = argparse.ArgumentParser(description="Generate A4 duplex-friendly career support worksheets PDF.")
    parser.add_argument(
        "--out",
        default=str(Path.cwd() / "career_support_worksheets_A4_2sheets_duplex.pdf"),
        help="Output PDF path",
    )
    args = parser.parse_args()
    build_pdf(Path(args.out))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

