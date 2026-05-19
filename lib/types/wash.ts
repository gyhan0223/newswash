export type WashMode = "url" | "text"

export interface WashTerm {
  term: string
  explanation: string
  example: string
}

export interface WashResult {
  summary: string[]
  terms: WashTerm[]
}
