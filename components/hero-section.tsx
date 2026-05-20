import { Sparkles } from "lucide-react"

export function HeroSection() {
  return (
    <section className="mb-12 text-center md:mb-16">
      {/* Logo / Brand */}
      <div className="mb-8 flex items-center justify-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary">
          <Sparkles className="h-5 w-5 text-primary-foreground" />
        </div>
        <span className="text-lg font-semibold tracking-tight text-foreground">
          뉴스 세탁기
        </span>
      </div>

      {/* Main Headline */}
      <h1 className="mb-4 text-balance text-3xl font-bold leading-tight tracking-tight text-foreground md:text-4xl lg:text-5xl">
        뉴스가 7세 수준으로
        <br />
        <span className="text-primary">쉬워집니다</span>
      </h1>

      {/* Sub-headline */}
      <p className="mx-auto max-w-md text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
        뉴스의 권위는 그대로,
        <br className="hidden md:block" />
        설명은 초등학생도 이해하게.
      </p>
    </section>
  )
}
