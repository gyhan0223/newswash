"use client"

import { useState } from "react"
import { Link2, FileText, Sparkles, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface InputSectionProps {
  onWash: () => void
  isLoading: boolean
}

type InputMode = "url" | "text"

export function InputSection({ onWash, isLoading }: InputSectionProps) {
  const [mode, setMode] = useState<InputMode>("url")
  const [inputValue, setInputValue] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim()) {
      onWash()
    }
  }

  return (
    <section className="mb-12">
      <form onSubmit={handleSubmit}>
        {/* Toggle Switch */}
        <div className="mb-6 flex justify-center">
          <div className="inline-flex rounded-2xl bg-muted p-1">
            <button
              type="button"
              onClick={() => setMode("url")}
              className={cn(
                "flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition-all duration-200",
                mode === "url"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Link2 className="h-4 w-4" />
              URL 붙여넣기
            </button>
            <button
              type="button"
              onClick={() => setMode("text")}
              className={cn(
                "flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition-all duration-200",
                mode === "text"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <FileText className="h-4 w-4" />
              텍스트 붙여넣기
            </button>
          </div>
        </div>

        {/* Input Container */}
        <div className="relative mb-6">
          <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-shadow duration-200 focus-within:shadow-md focus-within:ring-2 focus-within:ring-primary/20">
            {mode === "url" ? (
              <input
                type="url"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="뉴스 기사 URL을 붙여넣으세요"
                className="w-full bg-transparent px-6 py-5 text-base text-foreground placeholder:text-muted-foreground focus:outline-none md:text-lg"
              />
            ) : (
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="뉴스 기사 내용을 붙여넣으세요"
                rows={6}
                className="w-full resize-none bg-transparent px-6 py-5 text-base leading-relaxed text-foreground placeholder:text-muted-foreground focus:outline-none md:text-lg"
              />
            )}
          </div>
        </div>

        {/* Wash Button */}
        <button
          type="submit"
          disabled={!inputValue.trim() || isLoading}
          className={cn(
            "group relative w-full overflow-hidden rounded-2xl bg-primary px-8 py-4 text-base font-semibold text-primary-foreground shadow-lg transition-all duration-300 md:text-lg",
            "hover:shadow-xl hover:shadow-primary/25 hover:scale-[1.02]",
            "active:scale-[0.98]",
            "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-lg"
          )}
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                세탁 중...
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5 transition-transform duration-300 group-hover:rotate-12" />
                세탁하기
              </>
            )}
          </span>
          
          {/* Hover Effect Gradient */}
          <div className="absolute inset-0 -z-0 bg-gradient-to-r from-primary via-primary to-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </button>
      </form>
    </section>
  )
}
