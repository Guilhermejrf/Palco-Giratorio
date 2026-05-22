import { create } from 'zustand'
import { opportunities } from '../constants/mockData'
import type {
  Circuit,
  CircuitOpportunity,
  CircuitStopDraft,
  CostSimulation,
  DraftCircuit,
} from '../types/circuit.types'

interface CircuitStore {
  draftCircuit: DraftCircuit | null
  opportunities: CircuitOpportunity[]
  startDraftCircuit: (showId: string) => void
  addStop: (stop: CircuitStopDraft) => void
  removeStop: (stopId: string) => void
  reorderStops: (orderedIds: string[]) => void
  addContractor: (contractorId: string, contractorType: string) => void
  calculateCosts: () => Promise<CostSimulation>
  submitCircuit: () => Promise<Circuit>
}

export const useCircuitStore = create<CircuitStore>((set, get) => ({
  draftCircuit: null,
  opportunities,
  startDraftCircuit: (showId) => set({ draftCircuit: { showId, stops: [], contractors: [] } }),
  addStop: (stop) =>
    set((state) => ({
      draftCircuit: state.draftCircuit
        ? { ...state.draftCircuit, stops: [...state.draftCircuit.stops, stop] }
        : null,
    })),
  removeStop: (stopId) =>
    set((state) => ({
      draftCircuit: state.draftCircuit
        ? {
            ...state.draftCircuit,
            stops: state.draftCircuit.stops.filter((stop) => stop.id !== stopId),
          }
        : null,
    })),
  reorderStops: (orderedIds) =>
    set((state) => {
      if (!state.draftCircuit) return state
      const ordered = orderedIds
        .map((id) => state.draftCircuit?.stops.find((stop) => stop.id === id))
        .filter(Boolean) as CircuitStopDraft[]
      return { draftCircuit: { ...state.draftCircuit, stops: ordered } }
    }),
  addContractor: (contractorId, contractorType) =>
    set((state) => ({
      draftCircuit: state.draftCircuit
        ? {
            ...state.draftCircuit,
            contractors: [...state.draftCircuit.contractors, { id: contractorId, type: contractorType }],
          }
        : null,
    })),
  calculateCosts: async () => {
    const draft = get().draftCircuit
    const stops = draft?.stops.length ?? 1
    const contractors = draft?.contractors.length || stops
    const total = 12000 + stops * 6800
    return { total, perContractor: Math.round(total / contractors) }
  },
  submitCircuit: async () => {
    throw new Error('Demo sem backend: proposta preparada para envio.')
  },
}))
