"use client"

import { useState } from "react"
import { Link2, FileText, Sparkles, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import type { WashMode, WashResult } from "@/lib/types/wash"

interface InputSectionProps {
  isLoading: boolean
  onWashStart: () => void
  onWashComplete: (result: WashResult) => void
  onWashError: (message: string) => void
}

export function InputSection({
  isLoading,
  onWashStart,
  onWashComplete,
  onWashError,
}: InputSectionProps) {
  const [mode, setMode] = useState<WashMode>("url")
  const [inputValue, setInputValue] = useState("")
  const [error, setError] = useState<string>("")

  const isValidUrl = (urlStr: string) => {
    try {
      new URL(urlStr)
      return true
    } catch {
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const trimmedValue = inputValue.trim()
    if (!trimmedValue) return

    if (mode === "url" && !isValidUrl(trimmedValue)) {
      setError("올바른 URL 형식이 아닙니다. (예: https://example.com)")
      return
    }

    onWashStart()

    try {
      const response = await fetch("/api/wash", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, inputValue: trimmedValue }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error ?? "세탁 요청에 실패했습니다.")
      }

      onWashComplete(data as WashResult)
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "세탁 처리 중 오류가 발생했습니다."
      setError(message)
      onWashError(message)
    }
  }

  const handleModeChange = (newMode: WashMode) => {
    setMode(newMode)
    setError("")
    setInputValue("")
  }

  return (
    <section className="mb-12">
      <form onSubmit={handleSubmit}>
        <div className="mb-6 flex justify-center">
          <ModeToggle mode={mode} onModeChange={handleModeChange} />
        </div>

        <div className="relative mb-2">
          <div
            className={cn(
              "overflow-hidden rounded-3xl border bg-card shadow-sm transition-shadow duration-200 focus-within:shadow-md focus-within:ring-2",
              error
                ? "border-red-500 focus-within:ring-red-500/20"
                : "border-border focus-within:ring-primary/20"
            )}
          >
            {mode === "url" ? (
              <input
                type="url"
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value)
                  if (error) setError("")
                }}
                placeholder="뉴스 기사 URL을 붙여넣으세요"
                className="w-full bg-transparent px-6 py-5 text-base text-foreground placeholder:text-muted-foreground focus:outline-none md:text-lg"
              />
            ) : (
              <textarea
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value)
                  if (error) setError("")
                }}
                placeholder="뉴스 기사 내용을 붙여넣으세요"
                rows={6}
                className="w-full resize-none bg-transparent px-6 py-5 text-base leading-relaxed text-foreground placeholder:text-muted-foreground focus:outline-none md:text-lg"
              />
            )}
          </div>
        </div>

        {error && (
          <p className="mb-4 px-2 text-sm text-red-500 animate-in fade-in slide-in-from-top-1">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={!inputValue.trim() || isLoading}
          className={cn(
            "group relative w-full overflow-hidden rounded-2xl bg-primary px-8 py-4 text-base font-semibold text-primary-foreground shadow-lg transition-all duration-300 md:text-lg",
            "hover:shadow-xl hover:shadow-primary/25 hover:scale-[1.02]",
            "active:scale-[0.98]",
            "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-lg",
            !error && "mt-4"
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

          <div className="absolute inset-0 -z-0 bg-gradient-to-r from-primary via-primary to-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </button>
      </form>
    </section>
  )
}

function ModeToggle({
  mode,
  onModeChange,
}: {
  mode: WashMode
  onModeChange: (mode: WashMode) => void
}) {
  return (
    <div className="inline-flex rounded-2xl bg-muted p-1">
      <button
        type="button"
        onClick={() => onModeChange("url")}
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
        onClick={() => onModeChange("text")}
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
  )
}
