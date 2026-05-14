"use client"

import { useState } from "react"
import { HeroSection } from "@/components/hero-section"
import { InputSection } from "@/components/input-section"
import { ResultSection } from "@/components/result-section"

export default function NewsLaundryPage() {
  const [showResults, setShowResults] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleWash = () => {
    setIsLoading(true)
    // Simulate washing/processing
    setTimeout(() => {
      setIsLoading(false)
      setShowResults(true)
    }, 2000)
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-5 py-12 md:py-20">
        <HeroSection />
        <InputSection onWash={handleWash} isLoading={isLoading} />
        {showResults && <ResultSection />}
      </div>
    </main>
  )
}
