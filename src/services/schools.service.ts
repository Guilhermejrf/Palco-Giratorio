import { schools } from '../constants/mockData'

export const schoolsService = {
  list: async () => schools,
  nearCircuit: async () => schools.filter((school) => school.region === 'Agreste' || school.neverServed),
}
