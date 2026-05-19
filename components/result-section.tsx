"use client"

import { useState } from "react"
import {
  ListOrdered,
  ScrollText,
  BookOpen,
  Instagram,
  Check,
  Copy,
  Sparkles,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { WashResult } from "@/lib/types/wash"

interface ResultSectionProps {
  result: WashResult
}

export function ResultSection({ result }: ResultSectionProps) {
  const [copied, setCopied] = useState(false)

  const copyText = [
    "📰 3줄 요약",
    ...result.summary.map((line, i) => `${i + 1}. ${line}`),
    "",
    "📖 쉽게 풀어쓴 본문",
    result.story,
    "",
    "💡 어려운 용어 쉬운 풀이",
    ...result.terms.map(
      (t) => `• ${t.term}: ${t.explanation}\n  예) ${t.example}`
    ),
  ].join("\n")

  const handleCopy = async () => {
    await navigator.clipboard.writeText(copyText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleInstagramShare = () => {
    alert("인스타그램 스토리로 공유할 이미지가 생성됩니다!")
  }

  return (
    <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-10 flex justify-center md:mb-12">
        <div className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground">
          <Sparkles className="h-4 w-4 text-primary" />
          세탁 완료
        </div>
      </div>

      <MotionCards result={result} />

      <div className="mt-12 flex flex-col gap-3 sm:flex-row md:mt-14">
        <button
          onClick={handleCopy}
          className={cn(
            "flex flex-1 items-center justify-center gap-2 rounded-2xl border border-border bg-card px-6 py-4 text-base font-medium text-foreground shadow-sm transition-all duration-200",
            "hover:bg-muted hover:shadow-md",
            "active:scale-[0.98]"
          )}
        >
          {copied ? (
            <>
              <Check className="h-5 w-5 text-emerald-600" />
              복사 완료!
            </>
          ) : (
            <>
              <Copy className="h-5 w-5" />
              내용 복사하기
            </>
          )}
        </button>

        <button
          onClick={handleInstagramShare}
          className={cn(
            "group flex flex-1 items-center justify-center gap-2 rounded-2xl px-6 py-4 text-base font-semibold text-primary-foreground shadow-lg transition-all duration-300",
            "bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500",
            "hover:shadow-xl hover:scale-[1.02]",
            "active:scale-[0.98]"
          )}
        >
          <Instagram className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
          Instagram Story 공유
        </button>
      </div>

      <p className="mt-10 text-center text-sm leading-relaxed text-muted-foreground md:mt-12">
        AI가 생성한 요약입니다. 원문과 함께 확인해주세요.
      </p>
    </section>
  )
}

function MotionCards({ result }: { result: WashResult }) {
  return (
    <div className="flex flex-col gap-10 md:gap-12">
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm transition-shadow duration-200 hover:shadow-md md:p-8">
        <div className="mb-6 flex items-center gap-3 md:mb-7">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10">
            <ListOrdered className="h-5 w-5 text-primary" />
          </div>
          <h3 className="text-lg font-semibold tracking-tight text-foreground md:text-xl">
            3줄 요약
          </h3>
        </div>
        <ul className="flex flex-col gap-4 md:gap-5">
          {result.summary.map((line, index) => (
            <li key={index} className="flex items-start gap-3 md:gap-4">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-muted text-xs font-semibold text-muted-foreground md:h-7 md:w-7 md:text-sm">
                {index + 1}
              </span>
              <span className="text-base leading-relaxed text-foreground/95 md:text-lg md:leading-relaxed">
                {line}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm transition-shadow duration-200 hover:shadow-md md:p-8">
        <div className="mb-6 flex items-center gap-3 md:mb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10">
            <ScrollText className="h-5 w-5 text-primary" />
          </div>
          <h3 className="text-lg font-semibold tracking-tight text-foreground md:text-xl">
            쉽게 풀어쓴 본문
          </h3>
        </div>
        <p
          className={cn(
            "whitespace-pre-wrap font-normal",
            "text-base leading-loose text-foreground/90 md:text-lg md:leading-loose"
          )}
        >
          {result.story}
        </p>
      </div>

      {result.terms.length > 0 && (
        <div className="rounded-3xl border border-amber-200/50 bg-accent p-6 shadow-sm transition-shadow duration-200 hover:shadow-md md:p-8">
          <div className="mb-6 flex items-center gap-3 md:mb-7">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-400/20">
              <BookOpen className="h-5 w-5 text-amber-600" />
            </div>
            <h3 className="text-lg font-semibold tracking-tight text-accent-foreground md:text-xl">
              어려운 용어 쉬운 풀이
            </h3>
          </div>
          <div className="flex flex-col gap-6 md:gap-7">
            {result.terms.map((item) => (
              <div key={item.term}>
                <p className="mb-2 font-semibold text-accent-foreground md:text-base">
                  {item.term}
                </p>
                <p className="text-base leading-relaxed text-accent-foreground/95 md:leading-loose">
                  {item.explanation}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-amber-800/90 md:text-base">
                  <span className="font-medium">예시:</span> {item.example}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
