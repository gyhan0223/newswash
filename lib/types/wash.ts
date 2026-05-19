export type WashMode = "url" | "text"

export interface WashTerm {
  term: string
  explanation: string
  example: string
}

export interface WashResult {
  summary: string[]
  /** 토스 스타일로 쉽고 친근하게 풀어쓴 기사 본문 */
  story: string
  terms: WashTerm[]
}
