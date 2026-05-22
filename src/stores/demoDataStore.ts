import { create } from 'zustand'
import {
  circuits as initialCircuits,
  opportunities as initialOpportunities,
  resources as initialResources,
  schools as initialSchools,
  shows as initialShows,
} from '../constants/mockData'
import { municipalities } from '../constants/municipalities'
import type { Circuit, CircuitOpportunity, CostShare } from '../types/circuit.types'
import type { Resource, ResourceType } from '../types/resource.types'
import type { School } from '../types/school.types'
import type { Show } from '../types/show.types'

// ─── Novos tipos de comunicação ───────────────────────────────────────────────

export interface CircuitMessage {
  id: string
  circuitId: string
  author: string
  authorRole: string
  content: string
  createdAt: string
}

export interface NetworkEvent {
  id: string
  type:
    | 'circuit_proposed'
    | 'contractor_confirmed'
    | 'contractor_declined'
    | 'school_joined'
    | 'interest_registered'
    | 'consolidation_created'
    | 'resource_shared'
    | 'post_presentation'
  actor: string
  subject: string
  description: string
  createdAt: string
  circuitId?: string
  showId?: string
}

export interface ShowInterest {
  id: string
  showId: string
  showName: string
  spaceName: string
  spaceCity: string
  period: string
  createdAt: string
}

export interface ContractorStatus {
  circuitId: string
  contractor: string
  status: 'pending' | 'confirmed' | 'declined'
  message?: string
  respondedAt?: string
}

export interface SchoolProposal {
  id: string
  schoolId: string
  schoolName: string
  circuitId: string
  showName: string
  date: string
  status: 'pending' | 'confirmed' | 'declined'
  studentsReached?: number
  impactNote?: string
}

// ─── Tipos internos ────────────────────────────────────────────────────────────

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

// ─── Dados mock iniciais da camada de comunicação ────────────────────────────

const initialMessages: CircuitMessage[] = [
  {
    id: 'msg-1',
    circuitId: 'circuito-mamulengo',
    author: 'Sesc Caruaru',
    authorRole: 'Gestor de Programação',
    content:
      'Confirmamos a data de 20 de maio. O espaço já está reservado e a divulgação está rodando nas redes. Precisamos confirmar o operador de luz local.',
    createdAt: '2026-05-18T09:30:00',
  },
  {
    id: 'msg-2',
    circuitId: 'circuito-mamulengo',
    author: 'Mamulengo Flor do Sertão',
    authorRole: 'Produção do grupo',
    content:
      'Ótimo! Sobre o operador de luz — a plataforma indicou Lia Produções em Arcoverde, disponível também para Caruaru. Já mandei mensagem.',
    createdAt: '2026-05-18T11:15:00',
  },
  {
    id: 'msg-3',
    circuitId: 'circuito-mamulengo',
    author: 'Sesc Arcoverde',
    authorRole: 'Coordenação Cultural',
    content:
      'A Lia é excelente, já trabalhamos com ela. Confirmo a parada de 22 de maio. Conseguimos também uma van de 8m³ disponível que pode servir de Caruaru até aqui — isso reduz o frete.',
    createdAt: '2026-05-18T14:00:00',
  },
  {
    id: 'msg-4',
    circuitId: 'circuito-mamulengo',
    author: 'Prefeitura de Olinda',
    authorRole: 'Secretaria de Cultura',
    content:
      'Bom dia. Confirmamos Olinda no dia 26. O Mercado Eufrásio Barbosa tem pátio aberto — não precisam trazer palco. Consegui hospedagem para a equipe na pousada parceira a R$90/pessoa.',
    createdAt: '2026-05-19T08:45:00',
  },
]

const initialFeed: NetworkEvent[] = [
  {
    id: 'feed-1',
    type: 'circuit_proposed',
    actor: 'Mamulengo Flor do Sertão',
    subject: 'Circuito Bonecos Acesos',
    description: 'Propôs o Circuito Bonecos Acesos com 4 paradas no Agreste e Grande Recife.',
    createdAt: '2026-05-17T10:00:00',
    circuitId: 'circuito-mamulengo',
  },
  {
    id: 'feed-2',
    type: 'contractor_confirmed',
    actor: 'Sesc Caruaru',
    subject: 'Circuito Bonecos Acesos',
    description: 'Confirmou participação no Circuito Bonecos Acesos como contratante da parada de Caruaru.',
    createdAt: '2026-05-17T14:30:00',
    circuitId: 'circuito-mamulengo',
  },
  {
    id: 'feed-3',
    type: 'interest_registered',
    actor: 'Sesc Serra Talhada',
    subject: 'Rio de Dentro',
    description:
      'Demonstrou interesse em receber Rio de Dentro (Núcleo São Francisco de Música) na primeira semana de julho.',
    createdAt: '2026-05-18T09:00:00',
    showId: 'rio-dentro',
  },
  {
    id: 'feed-4',
    type: 'interest_registered',
    actor: 'Sesc Salgueiro',
    subject: 'Rio de Dentro',
    description: 'Também demonstrou interesse em Rio de Dentro. Sistema detectou oportunidade de bloco com Serra Talhada.',
    createdAt: '2026-05-18T10:15:00',
    showId: 'rio-dentro',
  },
  {
    id: 'feed-5',
    type: 'school_joined',
    actor: 'Escola Mestre Vitalino',
    subject: 'Circuito Bonecos Acesos',
    description: 'Confirmou receber A Peleja do Riso para 760 alunos. Turmas de 10 a 17 anos participarão.',
    createdAt: '2026-05-18T15:00:00',
    circuitId: 'circuito-mamulengo',
  },
  {
    id: 'feed-6',
    type: 'resource_shared',
    actor: 'Sesc Arcoverde',
    subject: 'Técnico de luz cênica',
    description: 'Compartilhou técnico de luz cênica (Lia Produções) com a rede — disponível para circuitos no Sertão.',
    createdAt: '2026-05-19T08:00:00',
  },
  {
    id: 'feed-7',
    type: 'consolidation_created',
    actor: 'Central Logística',
    subject: 'Consolidação Agreste — jun/26',
    description:
      'Detectou sobreposição e sugeriu consolidação de cargas: Mamulengo Flor do Sertão + Cia Trapiá, economia de 28%.',
    createdAt: '2026-05-19T11:00:00',
  },
  {
    id: 'feed-8',
    type: 'contractor_confirmed',
    actor: 'Sesc Garanhuns',
    subject: 'Corpos do Agreste ao Alto Sertão',
    description: 'Confirmou participação no circuito de dança e já abriu agenda para junho.',
    createdAt: '2026-05-20T09:30:00',
    circuitId: 'circuito-corpos-sertao',
  },
  {
    id: 'feed-9',
    type: 'interest_registered',
    actor: 'Sesc Ouricuri',
    subject: 'Lonas Abertas',
    description:
      'Demonstrou interesse em Lonas Abertas (Coletivo Circo na Mata). Município com IAC 12 — prioridade para circulação.',
    createdAt: '2026-05-20T14:00:00',
    showId: 'lonas-abertas',
  },
  {
    id: 'feed-10',
    type: 'post_presentation',
    actor: 'Escola Monsenhor Abílio',
    subject: 'Cena de Rua',
    description: 'Registrou impacto pós-apresentação: 610 alunos alcançados. IAC de Palmares atualizado.',
    createdAt: '2026-05-21T16:00:00',
  },
]

const initialInterests: ShowInterest[] = [
  {
    id: 'int-1',
    showId: 'rio-dentro',
    showName: 'Rio de Dentro',
    spaceName: 'Sesc Serra Talhada',
    spaceCity: 'Serra Talhada',
    period: 'Primeira semana de julho',
    createdAt: '2026-05-18T09:00:00',
  },
  {
    id: 'int-2',
    showId: 'rio-dentro',
    showName: 'Rio de Dentro',
    spaceName: 'Sesc Salgueiro',
    spaceCity: 'Salgueiro',
    period: 'Primeira semana de julho',
    createdAt: '2026-05-18T10:15:00',
  },
  {
    id: 'int-3',
    showId: 'lonas-abertas',
    showName: 'Lonas Abertas',
    spaceName: 'Sesc Ouricuri',
    spaceCity: 'Ouricuri',
    period: 'Julho/2026',
    createdAt: '2026-05-20T14:00:00',
  },
]

const initialContractorStatuses: ContractorStatus[] = [
  { circuitId: 'circuito-mamulengo', contractor: 'Sesc Caruaru', status: 'confirmed', respondedAt: '2026-05-17T14:30:00' },
  { circuitId: 'circuito-mamulengo', contractor: 'Sesc Arcoverde', status: 'confirmed', respondedAt: '2026-05-18T08:00:00' },
  { circuitId: 'circuito-mamulengo', contractor: 'Sesc Recife', status: 'pending' },
  { circuitId: 'circuito-mamulengo', contractor: 'Prefeitura de Olinda', status: 'confirmed', respondedAt: '2026-05-19T08:45:00' },
  { circuitId: 'circuito-corpos-sertao', contractor: 'Sesc Caruaru', status: 'confirmed', respondedAt: '2026-05-19T10:00:00' },
  { circuitId: 'circuito-corpos-sertao', contractor: 'Sesc Garanhuns', status: 'confirmed', respondedAt: '2026-05-20T09:30:00' },
]

const initialSchoolProposals: SchoolProposal[] = [
  {
    id: 'sp-1',
    schoolId: 'esc-caruaru',
    schoolName: 'Escola Mestre Vitalino',
    circuitId: 'circuito-mamulengo',
    showName: 'A Peleja do Riso',
    date: '2026-05-20',
    status: 'confirmed',
    studentsReached: 760,
    impactNote: 'Alunos participaram da oficina de bonecos de luva após o espetáculo.',
  },
  {
    id: 'sp-2',
    schoolId: 'esc-floresta',
    schoolName: 'Escola Três Marias',
    circuitId: 'circuito-mamulengo',
    showName: 'A Peleja do Riso',
    date: '2026-05-22',
    status: 'pending',
  },
]

// ─── Store ─────────────────────────────────────────────────────────────────────

interface DemoDataStore {
  shows: Show[]
  circuits: Circuit[]
  opportunities: CircuitOpportunity[]
  resources: Resource[]
  schools: School[]
  resourceRequests: string[]
  includedSchoolIds: string[]
  logisticsConsolidations: LogisticsConsolidation[]
  // Camada de comunicação
  circuitMessages: CircuitMessage[]
  networkFeed: NetworkEvent[]
  showInterests: ShowInterest[]
  contractorStatuses: ContractorStatus[]
  schoolProposals: SchoolProposal[]
  // Ações existentes
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
  // Novas ações de comunicação
  sendCircuitMessage: (circuitId: string, author: string, authorRole: string, content: string) => void
  addNetworkEvent: (event: Omit<NetworkEvent, 'id' | 'createdAt'>) => void
  registerShowInterest: (showId: string, showName: string, spaceName: string, spaceCity: string, period: string) => void
  updateContractorStatus: (circuitId: string, contractor: string, status: 'confirmed' | 'declined', message?: string) => void
  confirmSchoolProposal: (proposalId: string, studentsReached: number, impactNote: string) => void
  declineSchoolProposal: (proposalId: string) => void
  sendSchoolProposal: (schoolId: string, schoolName: string, circuitId: string, showName: string, date: string) => void
}

const colors = ['#D4A017', '#B85C38', '#F2C94C', '#0D0D0D', '#8B3A22', '#6B6B6B']

const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
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
const coordsForCity = (city: string) =>
  municipalities.find((item) => item.name === city)?.coords ?? municipalities[0].coords

const nowISO = () => new Date().toISOString()

export const useDemoDataStore = create<DemoDataStore>((set, get) => ({
  shows: initialShows,
  circuits: initialCircuits,
  opportunities: initialOpportunities,
  resources: initialResources,
  schools: initialSchools,
  resourceRequests: [],
  includedSchoolIds: [],
  logisticsConsolidations: [],
  circuitMessages: initialMessages,
  networkFeed: initialFeed,
  showInterests: initialInterests,
  contractorStatuses: initialContractorStatuses,
  schoolProposals: initialSchoolProposals,

  // ─── Ações existentes ─────────────────────────────────────────────────────

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
    get().addNetworkEvent({
      type: 'circuit_proposed',
      actor: 'Novo grupo',
      subject: show.name,
      description: `Espetáculo "${show.name}" cadastrado na plataforma e disponível para contratação em bloco.`,
      showId: show.id,
    })
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
    // Cria statuses pendentes para todos os contratantes
    const newStatuses: ContractorStatus[] = contractors.map((c) => ({
      circuitId: circuit.id,
      contractor: c,
      status: 'pending',
    }))
    set((current) => ({
      circuits: [circuit, ...current.circuits],
      contractorStatuses: [...current.contractorStatuses, ...newStatuses],
      opportunities: opportunityId
        ? current.opportunities.filter((opportunity) => opportunity.id !== opportunityId)
        : current.opportunities,
    }))
    get().addNetworkEvent({
      type: 'circuit_proposed',
      actor: show.group,
      subject: circuit.name,
      description: `Propôs ${circuit.name} com ${stops.length} paradas. Convites enviados para ${contractors.length} contratantes.`,
      circuitId: circuit.id,
    })
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
    get().addNetworkEvent({
      type: 'resource_shared',
      actor: input.owner || 'Parceiro da rede',
      subject: input.name,
      description: `Cadastrou "${input.name}" (${input.type}) na rede — disponível em ${input.city || 'Recife'}.`,
    })
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
            { contractor: 'Sesc Pernambuco', value: sescValue, color: '#D4A017' },
            { contractor: 'Parceiros locais', value: circuit.totalCost - sescValue, color: '#B85C38' },
          ],
        }
      }),
    })),

  addLogisticsConsolidation: (input) =>
    set((state) => ({
      logisticsConsolidations: [{ ...input, id: `log-${Date.now()}` }, ...state.logisticsConsolidations],
    })),

  // ─── Novas ações de comunicação ───────────────────────────────────────────

  sendCircuitMessage: (circuitId, author, authorRole, content) => {
    const message: CircuitMessage = {
      id: `msg-${Date.now()}`,
      circuitId,
      author,
      authorRole,
      content,
      createdAt: nowISO(),
    }
    set((state) => ({ circuitMessages: [...state.circuitMessages, message] }))
  },

  addNetworkEvent: (event) => {
    const newEvent: NetworkEvent = {
      ...event,
      id: `feed-${Date.now()}`,
      createdAt: nowISO(),
    }
    set((state) => ({ networkFeed: [newEvent, ...state.networkFeed] }))
  },

  registerShowInterest: (showId, showName, spaceName, spaceCity, period) => {
    const interest: ShowInterest = {
      id: `int-${Date.now()}`,
      showId,
      showName,
      spaceName,
      spaceCity,
      period,
      createdAt: nowISO(),
    }
    set((state) => ({ showInterests: [interest, ...state.showInterests] }))
    get().addNetworkEvent({
      type: 'interest_registered',
      actor: spaceName,
      subject: showName,
      description: `${spaceName} (${spaceCity}) demonstrou interesse em receber "${showName}".`,
      showId,
    })
  },

  updateContractorStatus: (circuitId, contractor, status, message) => {
    set((state) => {
      const existing = state.contractorStatuses.find(
        (s) => s.circuitId === circuitId && s.contractor === contractor,
      )
      const updated: ContractorStatus = {
        circuitId,
        contractor,
        status,
        message,
        respondedAt: nowISO(),
      }
      return {
        contractorStatuses: existing
          ? state.contractorStatuses.map((s) =>
              s.circuitId === circuitId && s.contractor === contractor ? updated : s,
            )
          : [...state.contractorStatuses, updated],
      }
    })
    const circuit = get().circuits.find((c) => c.id === circuitId)
    get().addNetworkEvent({
      type: status === 'confirmed' ? 'contractor_confirmed' : 'contractor_declined',
      actor: contractor,
      subject: circuit?.name ?? 'Circuito',
      description:
        status === 'confirmed'
          ? `${contractor} confirmou participação no circuito "${circuit?.name}".`
          : `${contractor} recusou participação. Motivo: ${message ?? 'não informado'}.`,
      circuitId,
    })
  },

  confirmSchoolProposal: (proposalId, studentsReached, impactNote) => {
    set((state) => ({
      schoolProposals: state.schoolProposals.map((p) =>
        p.id === proposalId ? { ...p, status: 'confirmed', studentsReached, impactNote } : p,
      ),
    }))
    const proposal = get().schoolProposals.find((p) => p.id === proposalId)
    if (proposal) {
      get().addNetworkEvent({
        type: 'post_presentation',
        actor: proposal.schoolName,
        subject: proposal.showName,
        description: `${proposal.schoolName} confirmou a apresentação: ${studentsReached} alunos alcançados. "${impactNote}"`,
        circuitId: proposal.circuitId,
      })
    }
  },

  declineSchoolProposal: (proposalId) => {
    set((state) => ({
      schoolProposals: state.schoolProposals.map((p) =>
        p.id === proposalId ? { ...p, status: 'declined' } : p,
      ),
    }))
  },

  sendSchoolProposal: (schoolId, schoolName, circuitId, showName, date) => {
    const proposal: SchoolProposal = {
      id: `sp-${Date.now()}`,
      schoolId,
      schoolName,
      circuitId,
      showName,
      date,
      status: 'pending',
    }
    set((state) => ({ schoolProposals: [proposal, ...state.schoolProposals] }))
    get().addNetworkEvent({
      type: 'school_joined',
      actor: showName,
      subject: schoolName,
      description: `Proposta de apresentação enviada para ${schoolName}. Aguardando confirmação.`,
      circuitId,
    })
  },
}))
