import { create } from 'zustand'
import { circuits as initialCircuits, opportunities as initialOpportunities, resources as initialResources, schools as initialSchools, shows as initialShows } from '../constants/mockData'
import { municipalities } from '../constants/municipalities'
import type { Circuit, CircuitOpportunity, CostShare } from '../types/circuit.types'
import type { Resource, ResourceType } from '../types/resource.types'
import type { School } from '../types/school.types'
import type { Show } from '../types/show.types'

interface NewShowInput {
  name: string
  synopsis: string
  minFee: number
}

interface NewSchoolInput {
  name: string
  city: string
  students: number
  structure: string
}

interface NewResourceInput {
  name: string
  type: ResourceType
  city: string
  owner: string
  pricePerDay?: number
  availabilityText?: string
}

interface LogisticsConsolidation {
  id: string
  title: string
  vehicle: string
  date: string
  owner: string
}

interface DemoDataStore {
  shows: Show[]
  circuits: Circuit[]
  opportunities: CircuitOpportunity[]
  resources: Resource[]
  schools: School[]
  resourceRequests: string[]
  includedSchoolIds: string[]
  logisticsConsolidations: LogisticsConsolidation[]
  addShow: (input: NewShowInput) => Show
  addCircuit: (input: {
    showId: string
    cityIds: string[]
    contractorNames: string[]
    opportunityId?: string
    name?: string
  }) => Circuit
  addSchool: (input: NewSchoolInput) => School
  addResource: (input: NewResourceInput) => Resource
  requestResource: (resourceId: string) => void
  includeSchoolInCircuit: (schoolId: string) => void
  updateCircuitCostSplit: (circuitId: string, sescShare: number) => void
  addLogisticsConsolidation: (input: Omit<LogisticsConsolidation, 'id'>) => void
}

const colors = ['#5AAEA0', '#C4755A', '#D6A0AE', '#2E5F7E', '#F0B35A', '#6D8D79']

const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

const splitCost = (contractors: string[], totalCost: number): CostShare[] => {
  const safeContractors = contractors.length ? contractors : ['Sesc Pernambuco']
  const baseValue = Math.floor(totalCost / safeContractors.length)
  return safeContractors.map((contractor, index) => ({
    contractor,
    value: index === safeContractors.length - 1 ? totalCost - baseValue * index : baseValue,
    color: colors[index % colors.length],
  }))
}

const regionForCity = (city: string) => municipalities.find((item) => item.name === city)?.region ?? 'Rede PE'

const coordsForCity = (city: string) => municipalities.find((item) => item.name === city)?.coords ?? municipalities[0].coords

export const useDemoDataStore = create<DemoDataStore>((set, get) => ({
  shows: initialShows,
  circuits: initialCircuits,
  opportunities: initialOpportunities,
  resources: initialResources,
  schools: initialSchools,
  resourceRequests: [],
  includedSchoolIds: [],
  logisticsConsolidations: [],
  addShow: (input) => {
    const createdAt = Date.now()
    const show: Show = {
      id: `show-${slugify(input.name)}-${createdAt}`,
      name: input.name,
      group: 'Grupo em cadastro',
      originCity: 'Recife',
      synopsis: input.synopsis,
      languages: ['Teatro'],
      durationMinutes: 50,
      minAge: 10,
      minFee: input.minFee,
      hasWorkshop: true,
      workshopDescription: 'Ação formativa informada na etapa de revisão da demo.',
      presentations: 0,
      availability: ['2026-06-24', '2026-06-25', '2026-06-26'],
      rider: {
        stageWidth: 6,
        stageDepth: 4,
        sound: 'PA básico, 2 microfones e operador local',
        light: 'Mapa simples com luz frontal e contraluz',
        powerKw: 6,
        generator: false,
        cargoKg: 120,
        cargoM3: 1.8,
        setupHours: 2,
        technicians: 1,
      },
    }
    set((state) => ({ shows: [show, ...state.shows] }))
    return show
  },
  addCircuit: ({ showId, cityIds, contractorNames, opportunityId, name }) => {
    const state = get()
    const show = state.shows.find((item) => item.id === showId) ?? state.shows[0]
    const selectedCities = cityIds
      .map((id) => municipalities.find((city) => city.id === id))
      .filter(Boolean)
      .slice(0, 8)
    const stops = (selectedCities.length ? selectedCities : municipalities.slice(0, 2)).map((city, index) => ({
      id: `stop-${city!.id}-${Date.now()}-${index}`,
      municipalityId: city!.id,
      municipality: city!.name,
      venue: city!.venues[0] ?? `Ponto Cultural ${city!.name}`,
      date: show.availability[index] ?? `2026-06-${String(24 + index).padStart(2, '0')}`,
      time: index % 2 === 0 ? '19:00' : '10:00',
      status: 'pending' as const,
      coords: city!.coords,
      distanceFromPreviousKm: index === 0 ? undefined : 86 + index * 23,
      travelTime: index === 0 ? undefined : `${1 + index}h${index % 2 === 0 ? '20' : '05'}`,
    }))
    const contractors = contractorNames.length ? contractorNames : stops.map((stop) => `Sesc ${stop.municipality}`)
    const totalCost = Math.round(show.minFee + stops.length * 4200 + show.rider.cargoKg * 9)
    const circuit: Circuit = {
      id: `circuito-${slugify(show.name)}-${Date.now()}`,
      name: name ?? `Circuito ${show.name}`,
      status: 'PLANNING',
      region: Array.from(new Set(stops.map((stop) => regionForCity(stop.municipality)))).join(' e '),
      showId: show.id,
      showName: show.name,
      group: show.group,
      startDate: stops[0]?.date ?? '2026-06-24',
      endDate: stops[stops.length - 1]?.date ?? '2026-06-26',
      stops,
      contractors,
      totalCost,
      costShares: splitCost(contractors, totalCost),
      confirmedStops: 0,
    }
    set((current) => ({
      circuits: [circuit, ...current.circuits],
      opportunities: opportunityId
        ? current.opportunities.filter((opportunity) => opportunity.id !== opportunityId)
        : current.opportunities,
    }))
    return circuit
  },
  addSchool: (input) => {
    const school: School = {
      id: `esc-${slugify(input.name)}-${Date.now()}`,
      name: input.name,
      city: input.city || 'Recife',
      region: regionForCity(input.city || 'Recife'),
      students: input.students || 120,
      ageRange: '8 a 17 anos',
      interests: ['Teatro', 'Cultura Popular'],
      structures: [input.structure || 'Espaço multiuso'],
      neverServed: true,
    }
    set((state) => ({ schools: [school, ...state.schools] }))
    return school
  },
  addResource: (input) => {
    const resource: Resource = {
      id: `res-${slugify(input.name)}-${Date.now()}`,
      name: input.name,
      type: input.type,
      city: input.city || 'Recife',
      region: regionForCity(input.city || 'Recife'),
      owner: input.owner || 'Parceiro da rede',
      availability: input.availabilityText?.toLowerCase().includes('agenda') ? 'by_schedule' : 'available',
      pricePerDay: input.pricePerDay,
      networkShared: !input.pricePerDay,
      coords: coordsForCity(input.city || 'Recife'),
      rating: 4.7,
    }
    set((state) => ({ resources: [resource, ...state.resources] }))
    return resource
  },
  requestResource: (resourceId) =>
    set((state) => ({
      resourceRequests: [...state.resourceRequests, resourceId],
      resources: state.resources.map((resource) =>
        resource.id === resourceId ? { ...resource, availability: 'by_schedule' } : resource,
      ),
    })),
  includeSchoolInCircuit: (schoolId) =>
    set((state) => ({
      includedSchoolIds: state.includedSchoolIds.includes(schoolId)
        ? state.includedSchoolIds
        : [...state.includedSchoolIds, schoolId],
    })),
  updateCircuitCostSplit: (circuitId, sescShare) =>
    set((state) => ({
      circuits: state.circuits.map((circuit) => {
        if (circuit.id !== circuitId) return circuit
        const sescValue = Math.round((circuit.totalCost * sescShare) / 100)
        return {
          ...circuit,
          costShares: [
            { contractor: 'Sesc Pernambuco', value: sescValue, color: '#5AAEA0' },
            { contractor: 'Parceiros locais', value: circuit.totalCost - sescValue, color: '#C4755A' },
          ],
        }
      }),
    })),
  addLogisticsConsolidation: (input) =>
    set((state) => ({
      logisticsConsolidations: [{ ...input, id: `log-${Date.now()}` }, ...state.logisticsConsolidations],
    })),
}))
