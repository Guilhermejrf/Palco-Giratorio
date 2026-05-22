import { create } from 'zustand'
import { circuits } from '../constants/mockData'
import { municipalities as mockMunicipalities } from '../constants/municipalities'
import type { Circuit } from '../types/circuit.types'
import type { MapFilters, Municipality } from '../types/map.types'

interface MapStore {
  municipalities: Municipality[]
  activeFilters: MapFilters
  selectedMunicipality: Municipality | null
  activeCircuits: Circuit[]
  showCircuitRoutes: boolean
  showResourcesLayer: boolean
  setFilter: <K extends keyof MapFilters>(key: K, value: MapFilters[K]) => void
  selectMunicipality: (id: string | null) => void
  fetchMunicipalities: () => Promise<void>
  toggleCircuitRoutes: () => void
  toggleResourcesLayer: () => void
}

export const useMapStore = create<MapStore>((set, get) => ({
  municipalities: mockMunicipalities,
  activeFilters: { language: '', region: '', period: '30d', status: '' },
  selectedMunicipality: null,
  activeCircuits: circuits.filter((circuit) => circuit.status === 'IN_PROGRESS'),
  showCircuitRoutes: true,
  showResourcesLayer: false,
  setFilter: (key, value) =>
    set((state) => ({ activeFilters: { ...state.activeFilters, [key]: value } })),
  selectMunicipality: (id) =>
    set({
      selectedMunicipality: id
        ? get().municipalities.find((municipality) => municipality.id === id) ?? null
        : null,
    }),
  fetchMunicipalities: async () => {
    await new Promise((resolve) => setTimeout(resolve, 250))
    set({ municipalities: mockMunicipalities })
  },
  toggleCircuitRoutes: () => set((state) => ({ showCircuitRoutes: !state.showCircuitRoutes })),
  toggleResourcesLayer: () => set((state) => ({ showResourcesLayer: !state.showResourcesLayer })),
}))
