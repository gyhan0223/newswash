import { NextRequest, NextResponse } from "next/server"
import * as cheerio from "cheerio"
import OpenAI from "openai"
import type { WashResult } from "@/lib/types/wash"

const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1"
const OPENROUTER_MODEL = "deepseek/deepseek-chat"
const OPENROUTER_SITE_URL =
  process.env.OPENROUTER_SITE_URL ?? "https://localhost:3000"

function getOpenAIClient() {
  return new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: OPENROUTER_BASE_URL,
    defaultHeaders: {
      "HTTP-Referer": "https://v0-newswash.vercel.app/",
      "X-Title": "NewsWash",
    },
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
  const parsed = JSON.parse(raw) as Partial<WashResult> & Record<string, unknown>

  if (!Array.isArray(parsed.summary) || parsed.summary.length === 0) {
    throw new Error("AI 응답 형식이 올바르지 않습니다.")
  }

  let story = ""
  if (typeof parsed.story === "string") {
    story = parsed.story.trim()
  } else if (parsed.story != null) {
    story = String(parsed.story).trim()
  }
  if (!story) {
    throw new Error("AI 응답에 story(풀어쓴 본문)가 없거나 비어 있습니다.")
  }

  let terms: WashResult["terms"] = []
  if (Array.isArray(parsed.terms)) {
    terms = parsed.terms as WashResult["terms"]
  }

  return {
    summary: parsed.summary.slice(0, 3) as string[],
    story,
    terms,
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

    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json(
        { error: "OpenRouter API 키가 설정되지 않았습니다." },
        { status: 500 }
      )
    }

    const articleText =
      mode === "url"
        ? await scrapeArticle(inputValue.trim())
        : inputValue.trim()

    const openai = getOpenAIClient()
    const completion = await openai.chat.completions.create({
      model: OPENROUTER_MODEL,
      messages: [
        {
          role: "system",
          content: `너는 어려운 경제·정치 뉴스를 읽기 쉽게 바꿔 주는 '뉴스 세탁기'야.
반드시 아래 JSON 형식으로만 응답해. 다른 텍스트는 포함하지 마.

{
  "summary": ["핵심 요약 1줄", "핵심 요약 2줄", "핵심 요약 3줄"],
  "story": "토스체로 쉽고 다정하게 풀어쓴 기사 본문 이야기",
  "terms": [
    {
      "term": "어려운 용어",
      "explanation": "설명",
      "example": "사례"
    }
  ]
}

대화·문체 지침 (토스 UX 라이팅에 맞춤):
- 억지스러운 캐릭터 컨셉(예: 고슴도치 말투 등)은 절대 쓰지 마.
- 말투는 든든한 금융 전문가가 옆에서 다정하게 설명해 주듯, 담백하고 친근한 존댓말을 써. 예: "~해요", "~했죠", "~일까요?"
- 호흡은 짧게: 문장은 길게 늘이지 말고, "~해요.", "~했죠."처럼 문장이 끝나면 그 다음 내용 전에 한 박자 쉬는 느낌으로 줄을 바꾸거나 빈 줄로 여백을 줘서 툭툭 던지듯 다정한 대화처럼 읽히게 해.

"story" 필드 전용 레이아웃·가독성:
- 긴 글을 한 덩어리로 붙여 쓰지 마. 의미 단위(대략 2~3문장)마다 반드시 빈 줄 하나, 즉 줄바꿈 두 번(\\n\\n)을 넣어 단락을 나눠.
- 뉴스 원문의 맥락·인과관계는 생략하지 말고, 어려운 용어와 수치는 일상어로 풀되, 위 단락 규칙으로 모바일·웹에서 읽기 편하게 재구성해.
- JSON 문자열 안에서 줄바꿈은 표준 JSON 이스케이프로만 넣어: 실제 줄바꿈 한 번은 \\n, 단락 구분(빈 줄)은 \\n\\n. 따옴표(")는 반드시 이스케이프(\\")하고, 줄바꿈을 임의로 제거하거나 한 줄로 압축하지 마. 이렇게 쓰면 클라이언트가 JSON.parse 했을 때 story 안에 올바른 \\n이 살아 있어야 해.

"story" 출력 형태 예시(참고용 — 실제 내용은 기사에 맞게 바꿔):
"금리가 오르면 보통 대출을 줄여요.\\n\\n왜냐하면 이자 부담이 커지기 때문이죠.\\n\\n이번 조치도 그런 흐름에서 나온 거예요."

규칙:
- summary는 정확히 3개의 문자열
- story는 반드시 포함하는 하나의 문자열(빈 문자열 금지). 단락 구분을 위해 전체 길이에 걸쳐 \\n\\n을 여러 번 써도 됨.
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
