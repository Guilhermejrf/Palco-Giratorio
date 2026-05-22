export type UserRole = 'gestor_sesc' | 'artista' | 'tecnico' | 'escola' | 'espaco'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  city: string
  organization: string
}
