"use client"

import { useState } from "react"
import { HeroSection } from "@/components/hero-section"
import { InputSection } from "@/components/input-section"
import { ResultSection } from "@/components/result-section"
import type { WashResult } from "@/lib/types/wash"

export default function NewsLaundryPage() {
  const [showResults, setShowResults] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [washResult, setWashResult] = useState<WashResult | null>(null)

  const handleWashStart = () => {
    setIsLoading(true)
    setShowResults(false)
  }

  const handleWashComplete = (result: WashResult) => {
    setWashResult(result)
    setIsLoading(false)
    setShowResults(true)
  }

  const handleWashError = (_message: string) => {
    setIsLoading(false)
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-5 py-12 md:py-20">
        <HeroSection />
        <InputSection
          isLoading={isLoading}
          onWashStart={handleWashStart}
          onWashComplete={handleWashComplete}
          onWashError={handleWashError}
        />
        {showResults && washResult && <ResultSection result={washResult} />}
      </div>
    </main>
  )
}
