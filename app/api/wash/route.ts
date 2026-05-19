import { NextRequest, NextResponse } from "next/server"
import * as cheerio from "cheerio"
import OpenAI from "openai"
import type { WashResult } from "@/lib/types/wash"

function getOpenAIClient() {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })
}

const ARTICLE_SELECTORS = [
  "article",
  ".article-body",
  ".article_body",
  "#articleBody",
  "#articeBody",
  ".news_body",
  ".story-news",
  ".sc_article_body",
  ".newsct_article",
  "[itemprop='articleBody']",
  "main",
]

async function scrapeArticle(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      Accept: "text/html,application/xhtml+xml",
    },
  })

  if (!response.ok) {
    throw new Error("URL에서 기사를 가져올 수 없습니다.")
  }

  const html = await response.text()
  const $ = cheerio.load(html)

  $("script, style, nav, footer, aside, iframe, noscript").remove()

  let content = ""
  for (const selector of ARTICLE_SELECTORS) {
    const text = $(selector).first().text().trim()
    if (text.length > content.length) {
      content = text
    }
  }

  if (!content) {
    content = $("body").text()
  }

  content = content
    .replace(/\s+/g, " ")
    .replace(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g, "")
    .trim()

  if (content.length < 50) {
    throw new Error("기사 본문을 충분히 추출하지 못했습니다.")
  }

  return content.slice(0, 12000)
}

function parseWashResult(raw: string): WashResult {
  const parsed = JSON.parse(raw) as WashResult

  if (!Array.isArray(parsed.summary) || parsed.summary.length === 0) {
    throw new Error("AI 응답 형식이 올바르지 않습니다.")
  }

  if (!Array.isArray(parsed.terms)) {
    parsed.terms = []
  }

  return {
    summary: parsed.summary.slice(0, 3),
    terms: parsed.terms,
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { mode, inputValue } = body as {
      mode?: string
      inputValue?: string
    }

    if (!mode || !inputValue?.trim()) {
      return NextResponse.json(
        { error: "mode와 inputValue가 필요합니다." },
        { status: 400 }
      )
    }

    if (mode !== "url" && mode !== "text") {
      return NextResponse.json(
        { error: "mode는 url 또는 text여야 합니다." },
        { status: 400 }
      )
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API 키가 설정되지 않았습니다." },
        { status: 500 }
      )
    }

    const articleText =
      mode === "url"
        ? await scrapeArticle(inputValue.trim())
        : inputValue.trim()

    const openai = getOpenAIClient()
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `너는 어려운 경제/정치 뉴스를 7세 아이도 이해할 수 있게 아주 쉬운 비유를 들어 설명해주는 '뉴스 세탁기'야.
반드시 아래 JSON 형식으로만 응답해. 다른 텍스트는 포함하지 마.

{
  "summary": ["핵심 요약 1줄", "핵심 요약 2줄", "핵심 요약 3줄"],
  "terms": [
    {
      "term": "어려운 용어",
      "explanation": "7세도 이해할 수 있는 쉬운 설명",
      "example": "일상 생활 비유나 구체적 사례"
    }
  ]
}

규칙:
- summary는 정확히 3개의 문자열
- terms는 기사에서 나온 어려운 용어 2~5개
- 모든 문장은 한국어로 작성`,
        },
        {
          role: "user",
          content: `다음 뉴스 기사를 세탁해줘:\n\n${articleText}`,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    })

    const resultText = completion.choices[0]?.message?.content
    if (!resultText) {
      return NextResponse.json(
        { error: "AI 응답을 받지 못했습니다." },
        { status: 500 }
      )
    }

    const result = parseWashResult(resultText)
    return NextResponse.json(result)
  } catch (error) {
    console.error("Wash API error:", error)
    const message =
      error instanceof Error
        ? error.message
        : "세탁 처리 중 오류가 발생했습니다."
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
