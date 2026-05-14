"use client"

import { useState } from "react"
import { 
  ListOrdered, 
  Lightbulb, 
  TrendingUp, 
  Instagram, 
  Check,
  Copy,
  Sparkles
} from "lucide-react"
import { cn } from "@/lib/utils"

export function ResultSection() {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    const text = `📰 3줄 요약
1. 한국은행이 기준금리를 0.25%p 인하하여 2.75%로 결정
2. 경기 둔화와 물가 안정을 고려한 결정
3. 향후 추가 인하 가능성도 열어둔 상태

💡 쉬운 비유
은행이 대출 이자를 낮추는 것은 마치 놀이공원 입장료를 할인하는 것과 같아요!

📈 투자 영향
- 예금 이자 ↓ 대출 이자 ↓
- 부동산/주식 시장 상승 가능성`

    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleInstagramShare = () => {
    // In a real app, this would generate an image and open Instagram
    alert("인스타그램 스토리로 공유할 이미지가 생성됩니다!")
  }

  return (
    <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Success Badge */}
      <div className="mb-8 flex justify-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground">
          <Sparkles className="h-4 w-4 text-primary" />
          세탁 완료
        </div>
      </div>

      {/* Result Cards */}
      <div className="flex flex-col gap-4">
        {/* Card 1: 3줄 요약 */}
        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm transition-shadow duration-200 hover:shadow-md">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10">
              <ListOrdered className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">3줄 요약</h3>
          </div>
          <ul className="flex flex-col gap-3">
            <li className="flex items-start gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-muted text-xs font-semibold text-muted-foreground">
                1
              </span>
              <span className="text-base leading-relaxed text-foreground">
                한국은행이 기준금리를 0.25%p 인하하여 2.75%로 결정
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-muted text-xs font-semibold text-muted-foreground">
                2
              </span>
              <span className="text-base leading-relaxed text-foreground">
                경기 둔화와 물가 안정을 고려한 결정
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-muted text-xs font-semibold text-muted-foreground">
                3
              </span>
              <span className="text-base leading-relaxed text-foreground">
                향후 추가 인하 가능성도 열어둔 상태
              </span>
            </li>
          </ul>
        </div>

        {/* Card 2: 초딩도 이해하는 비유 */}
        <div className="rounded-3xl border border-amber-200/50 bg-accent p-6 shadow-sm transition-shadow duration-200 hover:shadow-md">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-400/20">
              <Lightbulb className="h-5 w-5 text-amber-600" />
            </div>
            <h3 className="text-lg font-semibold text-accent-foreground">초딩도 이해하는 비유</h3>
          </div>
          <p className="text-base leading-relaxed text-accent-foreground">
            은행이 대출 이자를 낮추는 것은 마치{" "}
            <span className="font-semibold text-amber-700">
              놀이공원 입장료를 할인
            </span>
            하는 것과 같아요! 입장료가 싸지면 더 많은 사람들이 놀이공원에 놀러 오겠죠?
            마찬가지로 이자가 낮아지면 더 많은 사람들이 돈을 빌려서 집도 사고, 사업도 하게 돼요. 🎢
          </p>
        </div>

        {/* Card 3: 내 돈에 미치는 영향 */}
        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm transition-shadow duration-200 hover:shadow-md">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/10">
              <TrendingUp className="h-5 w-5 text-emerald-600" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">내 돈(투자)에 미치는 영향</h3>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between rounded-2xl bg-muted/50 px-4 py-3">
              <span className="text-base text-foreground">예금 이자</span>
              <span className="flex items-center gap-1 font-semibold text-red-500">
                <span className="text-lg">↓</span> 감소
              </span>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-muted/50 px-4 py-3">
              <span className="text-base text-foreground">대출 이자</span>
              <span className="flex items-center gap-1 font-semibold text-emerald-600">
                <span className="text-lg">↓</span> 감소
              </span>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-muted/50 px-4 py-3">
              <span className="text-base text-foreground">부동산/주식</span>
              <span className="flex items-center gap-1 font-semibold text-emerald-600">
                <span className="text-lg">↑</span> 상승 가능성
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        {/* Copy Button */}
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

        {/* Instagram Share Button */}
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

      {/* Footer */}
      <p className="mt-8 text-center text-sm text-muted-foreground">
        AI가 생성한 요약입니다. 원문과 함께 확인해주세요.
      </p>
    </section>
  )
}
