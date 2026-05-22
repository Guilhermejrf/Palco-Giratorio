export type ArtisticLanguage =
  | 'Teatro'
  | 'Dança'
  | 'Circo'
  | 'Mamulengo'
  | 'Música'
  | 'Cultura Popular'

export interface Rider {
  stageWidth: number
  stageDepth: number
  sound: string
  light: string
  powerKw: number
  generator: boolean
  cargoKg: number
  cargoM3: number
  setupHours: number
  technicians: number
}

export interface Show {
  id: string
  name: string
  group: string
  originCity: string
  synopsis: string
  languages: ArtisticLanguage[]
  durationMinutes: number
  minAge: number
  maxAge?: number
  minFee: number
  hasWorkshop: boolean
  workshopDescription?: string
  presentations: number
  rider: Rider
  availability: string[]
}
