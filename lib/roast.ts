export interface Scores {
  originality: number
  marketSize: number
  executionRisk: number
  cringeFactor: number
}

export interface SavedRoast {
  id: string
  pitch: string
  mode: "savage" | "nice"
  roastText: string
  scores: Scores
  createdAt: string
}
