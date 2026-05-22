export interface School {
  id: string
  name: string
  city: string
  region: string
  students: number
  ageRange: string
  interests: string[]
  structures: string[]
  neverServed: boolean
  lastVisitMonths?: number
}
