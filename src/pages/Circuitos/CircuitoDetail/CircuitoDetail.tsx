import { CheckCircle2, Download, FileText, MessageSquare, Send, XCircle } from 'lucide-react'
import { useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { CircleMarker, MapContainer, Marker, Polyline, Popup, TileLayer, Tooltip } from 'react-leaflet'
import { useParams } from 'react-router-dom'
import { CircuitTimeline } from '../../../components/circuits/CircuitTimeline/CircuitTimeline'
import { CostSplitBar } from '../../../components/circuits/CostSplitBar/CostSplitBar'
import { PageHeader } from '../../../components/layout/PageHeader/PageHeader'
import { SchoolNearCircuit } from '../../../components/schools/SchoolNearCircuit/SchoolNearCircuit'
import { Button } from '../../../components/ui/Button/Button'
import { Card } from '../../../components/ui/Card/Card'
import { Modal } from '../../../components/ui/Modal/Modal'
import { Tabs } from '../../../components/ui/Tabs/Tabs'
import { municipalities } from '../../../constants/municipalities'
import { useAuthStore } from '../../../stores/authStore'
import { useDemoDataStore } from '../../../stores/demoDataStore'
import { formatCurrency } from '../../../utils/formatters'

const formatTime = (iso: string) => {
  const d = new Date(iso)
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }) +
    ' ' +
    d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

const tabs = ['Rota e paradas', 'Negociação', 'Discussão']

export const CircuitoDetail = () => {
  const { id } = useParams()
  const user = useAuthStore((state) => state.user)
  const [activeTab, setActiveTab] = useState(tabs[0])
  const [splitOpen, setSplitOpen] = useState(false)
  const [contractOpen, setContractOpen] = useState(false)
  const [declineOpen, setDeclineOpen] = useState<string | null>(null)
  const [declineMsg, setDeclineMsg] = useState('')
  const [sescShare, setSescShare] = useState(55)
  const [newMessage, setNewMessage] = useState('')
  const chatBottomRef = useRef<HTMLDivElement>(null)

  const circuits = useDemoDataStore((state) => state.circuits)
  const schools = useDemoDataStore((state) => state.schools)
  const includedSchoolIds = useDemoDataStore((state) => state.includedSchoolIds)
  const circuitMessages = useDemoDataStore((state) => state.circuitMessages)
  const contractorStatuses = useDemoDataStore((state) => state.contractorStatuses)
  const schoolProposals = useDemoDataStore((state) => state.schoolProposals)
  const updateCircuitCostSplit = useDemoDataStore((state) => state.updateCircuitCostSplit)
  const sendCircuitMessage = useDemoDataStore((state) => state.sendCircuitMessage)
  const updateContractorStatus = useDemoDataStore((state) => state.updateContractorStatus)
  const sendSchoolProposal = useDemoDataStore((state) => state.sendSchoolProposal)
  const confirmSchoolProposal = useDemoDataStore((state) => state.confirmSchoolProposal)

  const circuit = circuits.find((item) => item.id === id) ?? circuits[0]
  const messages = circuitMessages.filter((m) => m.circuitId === circuit.id)
  const statuses = contractorStatuses.filter((s) => s.circuitId === circuit.id)
  const circuitSchoolProposals = schoolProposals.filter((p) => p.circuitId === circuit.id)

  const includedSchools = schools
    .filter((school) => includedSchoolIds.includes(school.id))
    .map((school, index) => {
      const cityCoords =
        municipalities.find((municipality) => municipality.name === school.city)?.coords ??
        circuit.stops.find((stop) => stop.municipality === school.city)?.coords ??
        circuit.stops[0].coords
      return {
        ...school,
        coords: {
          lat: cityCoords.lat + 0.035 + index * 0.01,
          lng: cityCoords.lng + 0.035 + index * 0.01,
        },
      }
    })

  const confirmedCount = statuses.filter((s) => s.status === 'confirmed').length
  const pendingCount = statuses.filter((s) => s.status === 'pending').length

  const saveSimulation = () => {
    updateCircuitCostSplit(circuit.id, sescShare)
    toast.success('Nova divisão simulada salva como proposta.')
    setSplitOpen(false)
  }

  const sendMessage = () => {
    if (!newMessage.trim()) return
    sendCircuitMessage(
      circuit.id,
      user?.organization ?? 'Sesc Pernambuco',
      user?.role === 'gestor_sesc' ? 'Gestor de Programação' : 'Produção',
      newMessage.trim(),
    )
    setNewMessage('')
    setTimeout(() => chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
  }

  const handleConfirm = (contractor: string) => {
    updateContractorStatus(circuit.id, contractor, 'confirmed')
    toast.success(`${contractor} confirmado no circuito.`)
  }

  const handleDecline = () => {
    if (!declineOpen) return
    updateContractorStatus(circuit.id, declineOpen, 'declined', declineMsg || 'Indisponibilidade de agenda.')
    toast('Recusa registrada. O sistema buscará substituto na rota.')
    setDeclineOpen(null)
    setDeclineMsg('')
  }

  const handlePropose = (schoolId: string, schoolName: string) => {
    const stop = circuit.stops[0]
    sendSchoolProposal(schoolId, schoolName, circuit.id, circuit.showName, stop.date)
    toast.success(`Proposta enviada para ${schoolName}.`)
  }

  const handleConfirmPresentation = (proposalId: string) => {
    confirmSchoolProposal(proposalId, 420, 'Os alunos participaram com entusiasmo. Oficina pós-espetáculo realizada.')
    toast.success('Impacto registrado! O Índice de Acendimento Cultural do município foi atualizado.')
  }

  return (
    <div>
      <PageHeader title={circuit.name} subtitle={`${circuit.showName} · ${circuit.region}`} />
      <div className="p-4 md:p-8">
        <Tabs active={activeTab} onChange={setActiveTab} tabs={tabs} />

        {/* ─── Aba 1: Rota e paradas ─────────────────────────────────────── */}
        {activeTab === tabs[0] && (
          <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
            <section className="space-y-6">
              <Card interactive={false}>
                <h2 className="mb-4 font-display text-2xl">Timeline da rota</h2>
                <CircuitTimeline stops={circuit.stops} />
              </Card>
              <Card interactive={false}>
                <h2 className="mb-4 font-display text-2xl">Mapa da rota</h2>
                <div className="h-[320px] overflow-hidden rounded-2xl">
                  <MapContainer center={[circuit.stops[0].coords.lat, circuit.stops[0].coords.lng]} zoom={7}>
                    <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
                    <Polyline
                      positions={circuit.stops.map((stop) => [stop.coords.lat, stop.coords.lng])}
                      pathOptions={{ color: '#B85C38', weight: 4 }}
                    />
                    {circuit.stops.map((stop, index) => (
                      <Marker key={stop.id} position={[stop.coords.lat, stop.coords.lng]}>
                        <Tooltip>
                          {index + 1}. {stop.municipality} · {stop.date}
                        </Tooltip>
                      </Marker>
                    ))}
                    {includedSchools.map((school) => (
                      <CircleMarker
                        key={school.id}
                        center={[school.coords.lat, school.coords.lng]}
                        radius={10}
                        pathOptions={{ color: '#0D0D0D', fillColor: '#D4A017', fillOpacity: 0.9, weight: 3 }}
                      >
                        <Tooltip direction="top">Escola incluída · {school.name}</Tooltip>
                        <Popup>
                          <strong>{school.name}</strong>
                          <br />
                          Ponto formativo em {school.city}
                          <br />
                          {school.students} alunos
                        </Popup>
                      </CircleMarker>
                    ))}
                  </MapContainer>
                </div>
                {includedSchools.length > 0 && (
                  <div className="mt-3 rounded-2xl bg-[var(--color-cream)] p-3 text-sm text-[var(--color-warm-gray)]">
                    <strong className="text-[var(--color-charcoal)]">Pontos formativos no mapa:</strong>{' '}
                    {includedSchools.map((school) => school.name).join(', ')}
                  </div>
                )}
              </Card>
            </section>
            <aside className="space-y-6">
              <Card interactive={false}>
                <h2 className="mb-4 font-display text-2xl">Divisão de custos</h2>
                <CostSplitBar shares={circuit.costShares} />
                <p className="mt-4 text-sm text-[var(--color-warm-gray)]">
                  Total estimado: <strong>{formatCurrency(circuit.totalCost)}</strong>
                </p>
                <Button className="mt-4 w-full" onClick={() => setSplitOpen(true)} variant="secondary">
                  Simular nova divisão
                </Button>
                <Button
                  className="mt-2 w-full"
                  icon={<FileText className="h-4 w-4" />}
                  onClick={() => setContractOpen(true)}
                  variant="secondary"
                >
                  Gerar contrato do bloco
                </Button>
              </Card>
              <Card interactive={false}>
                <h2 className="mb-4 font-display text-2xl">Escolas próximas</h2>
                <SchoolNearCircuit circuitId={circuit.id} onPropose={handlePropose} />
              </Card>
            </aside>
          </div>
        )}

        {/* ─── Aba 2: Negociação ─────────────────────────────────────────── */}
        {activeTab === tabs[1] && (
          <div className="mt-6 grid gap-6 xl:grid-cols-2">
            {/* Status dos contratantes */}
            <Card interactive={false}>
              <h2 className="mb-1 font-display text-2xl">Contratantes</h2>
              <p className="mb-4 text-sm text-[var(--color-warm-gray)]">
                {confirmedCount} confirmados · {pendingCount} aguardando resposta
              </p>
              <div className="space-y-3">
                {circuit.contractors.map((contractor) => {
                  const status = statuses.find((s) => s.contractor === contractor)
                  const statusValue = status?.status ?? 'pending'
                  return (
                    <div
                      key={contractor}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--color-cream-dark)] p-4"
                    >
                      <div>
                        <p className="font-bold">{contractor}</p>
                        {status?.respondedAt && (
                          <p className="text-xs text-[var(--color-warm-gray)]">{formatTime(status.respondedAt)}</p>
                        )}
                        {status?.message && (
                          <p className="mt-1 text-xs text-[var(--color-warm-gray)]">"{status.message}"</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {statusValue === 'confirmed' && (
                          <span className="flex items-center gap-1 rounded-full bg-[var(--color-accent-200)] px-3 py-1 text-xs font-bold text-[var(--color-primary-700)]">
                            <CheckCircle2 className="h-3 w-3" /> Confirmado
                          </span>
                        )}
                        {statusValue === 'declined' && (
                          <span className="flex items-center gap-1 rounded-full bg-[var(--color-accent-100)] px-3 py-1 text-xs font-bold text-[var(--color-danger)]">
                            <XCircle className="h-3 w-3" /> Recusou
                          </span>
                        )}
                        {statusValue === 'pending' && (
                          <div className="flex gap-2">
                            <Button variant="secondary" onClick={() => handleConfirm(contractor)}>
                              Confirmar
                            </Button>
                            <button
                              className="rounded-xl px-3 py-1.5 text-sm font-semibold text-[var(--color-danger)] hover:bg-[var(--color-accent-100)]"
                              onClick={() => setDeclineOpen(contractor)}
                              type="button"
                            >
                              Recusar
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </Card>

            {/* Propostas para escolas */}
            <Card interactive={false}>
              <h2 className="mb-1 font-display text-2xl">Escolas na rota</h2>
              <p className="mb-4 text-sm text-[var(--color-warm-gray)]">
                Propostas de apresentação formativa enviadas. Registre o impacto após cada visita.
              </p>
              {circuitSchoolProposals.length === 0 && (
                <p className="text-sm text-[var(--color-warm-gray)]">
                  Nenhuma escola incluída ainda. Acesse "Escolas próximas" na aba Rota e paradas.
                </p>
              )}
              <div className="space-y-3">
                {circuitSchoolProposals.map((proposal) => (
                  <div
                    key={proposal.id}
                    className="rounded-2xl border border-[var(--color-cream-dark)] p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-bold">{proposal.schoolName}</p>
                        <p className="text-sm text-[var(--color-warm-gray)]">
                          {proposal.showName} · {proposal.date}
                        </p>
                      </div>
                      {proposal.status === 'confirmed' ? (
                        <span className="rounded-full bg-[var(--color-accent-200)] px-2 py-1 text-xs font-bold text-[var(--color-primary-700)]">
                          Realizada
                        </span>
                      ) : proposal.status === 'declined' ? (
                        <span className="rounded-full bg-[var(--color-accent-100)] px-2 py-1 text-xs font-bold text-[var(--color-danger)]">
                          Recusada
                        </span>
                      ) : (
                        <span className="rounded-full bg-[var(--color-accent-100)] px-2 py-1 text-xs font-bold text-[var(--color-charcoal)]">
                          Pendente
                        </span>
                      )}
                    </div>
                    {proposal.status === 'confirmed' && proposal.studentsReached && (
                      <p className="mt-2 text-sm font-semibold text-[var(--color-success)]">
                        {proposal.studentsReached} alunos alcançados · IAC atualizado
                      </p>
                    )}
                    {proposal.status === 'pending' && (
                      <Button
                        className="mt-3"
                        variant="secondary"
                        onClick={() => handleConfirmPresentation(proposal.id)}
                      >
                        Registrar impacto pós-apresentação
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* ─── Aba 3: Discussão ──────────────────────────────────────────── */}
        {activeTab === tabs[2] && (
          <div className="mt-6">
            <Card interactive={false}>
              <div className="mb-4 flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-[var(--color-secondary-300)]" />
                <h2 className="font-display text-2xl">Discussão entre parceiros</h2>
              </div>
              <p className="mb-4 text-sm text-[var(--color-warm-gray)]">
                Canal de comunicação entre todos os parceiros do circuito. Grupo, espaços e técnicos.
              </p>

              {/* Participantes */}
              <div className="mb-5 flex flex-wrap gap-2">
                {circuit.contractors.map((c) => (
                  <span
                    key={c}
                    className="rounded-full bg-[var(--color-cream)] px-3 py-1 text-xs font-semibold"
                  >
                    {c}
                  </span>
                ))}
                <span className="rounded-full bg-[var(--color-secondary-50)] px-3 py-1 text-xs font-semibold text-[var(--color-secondary-500)]">
                  {circuit.group}
                </span>
              </div>

              {/* Mensagens */}
              <div className="max-h-[420px] space-y-4 overflow-y-auto rounded-2xl bg-[var(--color-cream)] p-4">
                {messages.length === 0 && (
                  <p className="text-center text-sm text-[var(--color-warm-gray)]">
                    Nenhuma mensagem ainda. Seja o primeiro a falar.
                  </p>
                )}
                {messages.map((msg) => {
                  const isMe = msg.author === (user?.organization ?? 'Sesc Pernambuco')
                  return (
                    <div key={msg.id} className={`flex gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
                      <div
                        className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-sm font-bold text-white ${isMe ? 'bg-[var(--color-secondary-300)]' : 'bg-[var(--color-primary-700)]'}`}
                      >
                        {msg.author.charAt(0)}
                      </div>
                      <div className={`max-w-[75%] ${isMe ? 'items-end' : ''} flex flex-col`}>
                        <div className={`rounded-2xl p-3 text-sm ${isMe ? 'bg-[var(--color-secondary-50)]' : 'bg-white'}`}>
                          <p className="mb-1 text-xs font-bold text-[var(--color-warm-gray)]">
                            {msg.author} · {msg.authorRole}
                          </p>
                          <p>{msg.content}</p>
                        </div>
                        <p className="mt-1 text-[10px] text-[var(--color-warm-gray)]">{formatTime(msg.createdAt)}</p>
                      </div>
                    </div>
                  )
                })}
                <div ref={chatBottomRef} />
              </div>

              {/* Input de nova mensagem */}
              <div className="mt-4 flex gap-3">
                <input
                  className="flex-1 rounded-xl border border-[var(--color-cream-dark)] px-4 py-2.5 text-sm outline-none focus:border-[var(--color-primary-300)]"
                  placeholder={`Mensagem como ${user?.organization ?? 'Sesc Pernambuco'}...`}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                />
                <Button icon={<Send className="h-4 w-4" />} onClick={sendMessage}>
                  Enviar
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Modal de Contrato */}
      <Modal open={contractOpen} title="Contrato de Bloco de Contratação" onClose={() => setContractOpen(false)}>
        <div className="space-y-4 text-sm">
          <div className="rounded-2xl bg-[var(--color-cream)] p-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-warm-gray)]">
              Acende PE · Contratação em Bloco
            </p>
            <h3 className="mt-1 font-display text-xl">{circuit.name}</h3>
            <p className="text-[var(--color-warm-gray)]">{circuit.showName} · {circuit.group}</p>
          </div>
          <div>
            <p className="mb-2 font-bold">Partes contratantes:</p>
            <ul className="space-y-1">
              {circuit.contractors.map((contractor) => {
                const status = statuses.find((s) => s.contractor === contractor)
                return (
                  <li key={contractor} className="flex items-center gap-2">
                    {status?.status === 'confirmed' ? (
                      <CheckCircle2 className="h-4 w-4 text-[var(--color-success)]" />
                    ) : (
                      <span className="h-4 w-4 rounded-full border-2 border-[var(--color-cream-dark)]" />
                    )}
                    {contractor}
                    {status?.status === 'confirmed' ? (
                      <span className="text-xs text-[var(--color-success)]">✓ confirmado</span>
                    ) : (
                      <span className="text-xs text-[var(--color-warm-gray)]">(pendente)</span>
                    )}
                  </li>
                )
              })}
            </ul>
          </div>
          <div>
            <p className="mb-2 font-bold">Paradas e valores:</p>
            <div className="overflow-auto rounded-xl border border-[var(--color-cream-dark)]">
              <table className="w-full text-xs">
                <thead className="bg-[var(--color-cream)]">
                  <tr>
                    <th className="p-2 text-left">Município</th>
                    <th className="p-2 text-left">Venue</th>
                    <th className="p-2 text-left">Data</th>
                    <th className="p-2 text-right">Valor</th>
                  </tr>
                </thead>
                <tbody>
                  {circuit.stops.map((stop) => {
                    const share = circuit.costShares.find((s) =>
                      s.contractor.toLowerCase().includes(stop.municipality.toLowerCase()),
                    )
                    const value = share?.value ?? Math.round(circuit.totalCost / circuit.stops.length)
                    return (
                      <tr key={stop.id} className="border-t border-[var(--color-cream-dark)]">
                        <td className="p-2 font-bold">{stop.municipality}</td>
                        <td className="p-2">{stop.venue}</td>
                        <td className="p-2">{stop.date}</td>
                        <td className="p-2 text-right font-mono">{formatCurrency(value)}</td>
                      </tr>
                    )
                  })}
                  <tr className="border-t-2 border-[var(--color-primary-300)] bg-[var(--color-cream)]">
                    <td className="p-2 font-bold" colSpan={3}>Total do bloco</td>
                    <td className="p-2 text-right font-mono font-bold">{formatCurrency(circuit.totalCost)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="rounded-2xl border border-[var(--color-cream-dark)] p-3 text-xs text-[var(--color-warm-gray)]">
            <p>
              Este contrato regula a contratação coletiva de <strong>{circuit.showName}</strong> pelo sistema de
              Bloco de Contratação da plataforma Acende PE. Os valores são distribuídos conforme o número de
              apresentações por município. A logística de transporte será compartilhada, com custo proporcional ao
              volume de carga de cada parada.
            </p>
            <p className="mt-2">
              Gerado em: {new Date().toLocaleDateString('pt-BR')} · Acende PE · Sesc Pernambuco
            </p>
          </div>
          <Button
            icon={<Download className="h-4 w-4" />}
            onClick={() => {
              toast.success('Contrato enviado por e-mail para todos os contratantes.')
              setContractOpen(false)
            }}
          >
            Enviar contrato para todos
          </Button>
        </div>
      </Modal>

      {/* Modal de recusa */}
      <Modal open={Boolean(declineOpen)} title="Registrar recusa" onClose={() => setDeclineOpen(null)}>
        <div className="space-y-4">
          <p className="text-sm text-[var(--color-warm-gray)]">
            Informe o motivo da recusa de <strong>{declineOpen}</strong>. O sistema buscará alternativas.
          </p>
          <textarea
            className="h-24 w-full rounded-xl border border-[var(--color-cream-dark)] p-3 text-sm outline-none focus:border-[var(--color-primary-300)]"
            placeholder="Ex: Indisponibilidade de agenda nesta data..."
            value={declineMsg}
            onChange={(e) => setDeclineMsg(e.target.value)}
          />
          <Button onClick={handleDecline}>Confirmar recusa</Button>
        </div>
      </Modal>

      {/* Modal de nova divisão */}
      <Modal open={splitOpen} title="Simular nova divisão" onClose={() => setSplitOpen(false)}>
        <div className="space-y-5">
          <label className="block text-sm font-semibold">
            Participação Sesc Pernambuco: {sescShare}%
            <input
              className="mt-3 w-full accent-[var(--color-secondary-300)]"
              max="80"
              min="20"
              onChange={(event) => setSescShare(Number(event.target.value))}
              type="range"
              value={sescShare}
            />
          </label>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-2xl bg-[var(--color-cream)] p-4">
              <p className="text-xs text-[var(--color-warm-gray)]">Sesc Pernambuco</p>
              <strong>{formatCurrency((circuit.totalCost * sescShare) / 100)}</strong>
            </div>
            <div className="rounded-2xl bg-[var(--color-cream)] p-4">
              <p className="text-xs text-[var(--color-warm-gray)]">Parceiros</p>
              <strong>{formatCurrency((circuit.totalCost * (100 - sescShare)) / 100)}</strong>
            </div>
          </div>
          <Button onClick={saveSimulation}>Salvar simulação</Button>
        </div>
      </Modal>
    </div>
  )
}
