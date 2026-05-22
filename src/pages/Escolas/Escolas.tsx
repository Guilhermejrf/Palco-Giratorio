import { useState } from 'react'
import { CheckCircle2, Clock, MessageSquare, Send, Users } from 'lucide-react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '../../components/layout/PageHeader/PageHeader'
import { SchoolCard } from '../../components/schools/SchoolCard/SchoolCard'
import { Button } from '../../components/ui/Button/Button'
import { Input } from '../../components/ui/Input/Input'
import { Modal } from '../../components/ui/Modal/Modal'
import { Select } from '../../components/ui/Select/Select'
import { useDemoDataStore } from '../../stores/demoDataStore'
import type { School } from '../../types/school.types'

const languageOptions = ['Teatro', 'Dança', 'Circo', 'Mamulengo', 'Música', 'Cultura Popular']
const activityOptions = ['Espetáculo', 'Oficina', 'Roda de conversa', 'Espetáculo + Oficina']

interface ConversationMessage {
  id: string
  author: string
  role: string
  content: string
  time: string
  mine?: boolean
}

const initialMessagesForSchool = (school: School): ConversationMessage[] => [
  {
    id: `${school.id}-m1`,
    author: 'Coordenação de Programação',
    role: 'Gestor Sesc',
    content: `Identificamos ${school.name} como ponto formativo estratégico em ${school.city}. Podemos alinhar data, público e estrutura disponível?`,
    time: '09:20',
    mine: true,
  },
  {
    id: `${school.id}-m2`,
    author: school.name,
    role: 'Coordenação pedagógica',
    content: `Temos interesse. A escola consegue organizar as turmas de ${school.ageRange} e confirmar o espaço mais adequado para a atividade.`,
    time: '10:05',
  },
]

export const Escolas = () => {
  const navigate = useNavigate()
  const [onlyNeverServed, setOnlyNeverServed] = useState(false)
  const [regionFilter, setRegionFilter] = useState('')
  const [ageFilter, setAgeFilter] = useState('')
  const [structureFilter, setStructureFilter] = useState('')
  const [registerOpen, setRegisterOpen] = useState(false)
  const [kitOpen, setKitOpen] = useState(false)
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null)
  const [conversationMessages, setConversationMessages] = useState<Record<string, ConversationMessage[]>>({})
  const [newMessage, setNewMessage] = useState('')
  const [schoolForm, setSchoolForm] = useState({
    name: '',
    city: '',
    students: '',
    structure: '',
    ageRange: '',
    interests: [] as string[],
    activityTypes: [] as string[],
  })
  const schools = useDemoDataStore((state) => state.schools)
  const addSchool = useDemoDataStore((state) => state.addSchool)
  const regionOptions = Array.from(new Set(schools.map((school) => school.region))).sort()
  const ageOptions = Array.from(new Set(schools.map((school) => school.ageRange))).sort()
  const structureOptions = Array.from(new Set(schools.flatMap((school) => school.structures))).sort()
  const hasFilters = Boolean(regionFilter || ageFilter || structureFilter || onlyNeverServed)
  const visibleSchools = schools.filter((school) => {
    const regionMatches = !regionFilter || school.region === regionFilter
    const ageMatches = !ageFilter || school.ageRange === ageFilter
    const structureMatches = !structureFilter || school.structures.includes(structureFilter)
    const servedMatches = !onlyNeverServed || school.neverServed
    return regionMatches && ageMatches && structureMatches && servedMatches
  })

  const clearFilters = () => {
    setRegionFilter('')
    setAgeFilter('')
    setStructureFilter('')
    setOnlyNeverServed(false)
  }

  const openConversation = (school: School) => {
    setSelectedSchool(school)
    setNewMessage('')
  }

  const closeConversation = () => {
    setSelectedSchool(null)
    setNewMessage('')
  }

  const currentMessages = selectedSchool
    ? conversationMessages[selectedSchool.id] ?? initialMessagesForSchool(selectedSchool)
    : []

  const sendMessage = () => {
    if (!selectedSchool || !newMessage.trim()) return
    const message: ConversationMessage = {
      id: `${selectedSchool.id}-${Date.now()}`,
      author: 'Sesc Pernambuco',
      role: 'Gestor de programação',
      content: newMessage.trim(),
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      mine: true,
    }
    setConversationMessages((state) => ({
      ...state,
      [selectedSchool.id]: [...currentMessages, message],
    }))
    setNewMessage('')
  }

  const confirmVisit = () => {
    if (!selectedSchool) return
    toast.success(`Tratativa confirmada com ${selectedSchool.name}.`)
  }

  const includeConversationSchoolInRoute = () => {
    if (!selectedSchool) return
    toast.success(`${selectedSchool.name} adicionada como parada formativa sugerida.`)
    navigate('/circuitos/novo', { state: { schoolId: selectedSchool.id } })
  }

  const toggleInterest = (lang: string) =>
    setSchoolForm((f) => ({
      ...f,
      interests: f.interests.includes(lang) ? f.interests.filter((i) => i !== lang) : [...f.interests, lang],
    }))

  const toggleActivity = (act: string) =>
    setSchoolForm((f) => ({
      ...f,
      activityTypes: f.activityTypes.includes(act) ? f.activityTypes.filter((a) => a !== act) : [...f.activityTypes, act],
    }))

  const saveSchool = () => {
    addSchool({
      name: schoolForm.name || 'Nova escola da rede',
      city: schoolForm.city || 'Recife',
      students: Number(schoolForm.students) || 120,
      structure: schoolForm.structure || 'Espaço multiuso',
    })
    toast.success('Escola cadastrada e marcada para curadoria da rede.')
    setSchoolForm({ name: '', city: '', students: '', structure: '', ageRange: '', interests: [], activityTypes: [] })
    setRegisterOpen(false)
  }

  return (
    <div>
      <PageHeader
        title="Escolas"
        subtitle="Escolas da rede para ações formativas, apresentações diurnas e rotas ampliadas."
        decorativeShape="star"
        decorativeColor="var(--color-primary-100)"
        actions={
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setKitOpen(true)}>
              Kit pedagógico
            </Button>
            <Button onClick={() => setRegisterOpen(true)}>Cadastrar escola</Button>
          </div>
        }
      />
      <div className="space-y-5 p-4 md:p-8">
        <div className="grid gap-3 rounded-2xl bg-white p-4 md:grid-cols-[1fr_1fr_1fr_auto_auto]">
          <Select
            aria-label="Filtrar por região"
            options={[
              { label: 'Todas as regiões', value: '' },
              ...regionOptions.map((region) => ({ label: region, value: region })),
            ]}
            value={regionFilter}
            onChange={(event) => setRegionFilter(event.target.value)}
          />
          <Select
            aria-label="Filtrar por faixa etária"
            options={[
              { label: 'Todas as faixas', value: '' },
              ...ageOptions.map((ageRange) => ({ label: ageRange, value: ageRange })),
            ]}
            value={ageFilter}
            onChange={(event) => setAgeFilter(event.target.value)}
          />
          <Select
            aria-label="Filtrar por estrutura"
            options={[
              { label: 'Todas as estruturas', value: '' },
              ...structureOptions.map((structure) => ({ label: structure, value: structure })),
            ]}
            value={structureFilter}
            onChange={(event) => setStructureFilter(event.target.value)}
          />
          <button
            className={`min-h-10 rounded-lg px-3 py-2 text-sm font-semibold ${
              onlyNeverServed ? 'bg-[var(--color-primary-700)] text-white' : 'bg-white'
            }`}
            onClick={() => setOnlyNeverServed((value) => !value)}
            type="button"
          >
            Nunca atendidas
          </button>
          {hasFilters ? (
            <button
              className="min-h-10 rounded-lg px-3 py-2 text-sm font-semibold text-[var(--color-warm-gray)] hover:bg-[var(--color-cream)]"
              onClick={clearFilters}
              type="button"
            >
              Limpar
            </button>
          ) : null}
        </div>
        <div className="text-sm text-[var(--color-warm-gray)]">
          {visibleSchools.length} {visibleSchools.length === 1 ? 'escola encontrada' : 'escolas encontradas'}
        </div>
        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {visibleSchools.length ? (
            visibleSchools.map((school) => (
              <SchoolCard key={school.id} school={school} onOpenConversation={openConversation} />
            ))
          ) : (
            <div className="rounded-2xl bg-white p-6 text-sm text-[var(--color-warm-gray)]">
              Nenhuma escola encontrada com os filtros selecionados.
            </div>
          )}
        </div>
      </div>

      <Modal
        open={Boolean(selectedSchool)}
        title={`Tratativa formativa${selectedSchool ? ` · ${selectedSchool.name}` : ''}`}
        onClose={closeConversation}
      >
        {selectedSchool ? (
          <div className="space-y-5">
            <div className="grid gap-3 md:grid-cols-4">
              <div className="rounded-2xl bg-[var(--color-cream)] p-4">
                <Clock className="mb-2 h-4 w-4 text-[var(--color-secondary-300)]" />
                <p className="text-xs text-[var(--color-warm-gray)]">Status</p>
                <strong>Em alinhamento</strong>
              </div>
              <div className="rounded-2xl bg-[var(--color-cream)] p-4">
                <Users className="mb-2 h-4 w-4 text-[var(--color-secondary-300)]" />
                <p className="text-xs text-[var(--color-warm-gray)]">Público possível</p>
                <strong>{selectedSchool.students.toLocaleString('pt-BR')} alunos</strong>
              </div>
              <div className="rounded-2xl bg-[var(--color-cream)] p-4 md:col-span-2">
                <MessageSquare className="mb-2 h-4 w-4 text-[var(--color-secondary-300)]" />
                <p className="text-xs text-[var(--color-warm-gray)]">Estrutura informada</p>
                <strong>{selectedSchool.structures.join(' · ')}</strong>
              </div>
            </div>

            <section className="rounded-2xl border border-[var(--color-cream-dark)] p-4">
              <div className="mb-4 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-[var(--color-secondary-300)]" />
                <h3 className="font-display text-lg">Checklist da tratativa</h3>
              </div>
              <div className="grid gap-2 text-sm md:grid-cols-3">
                {[
                  'Compatibilizar estrutura',
                  'Enviar kit pedagógico',
                  'Registrar impacto no IAC',
                ].map((item, index) => (
                  <div key={item} className="flex items-center gap-2 rounded-xl bg-[var(--color-cream)] p-3">
                    <CheckCircle2
                      className={`h-4 w-4 ${index === 0 ? 'text-[var(--color-secondary-500)]' : 'text-[var(--color-warm-gray)]'}`}
                    />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-[var(--color-cream-dark)] p-4">
              <div className="mb-4 flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-[var(--color-secondary-300)]" />
                <h3 className="font-display text-lg">Conversa entre gestores</h3>
              </div>
              <div className="max-h-72 space-y-3 overflow-auto pr-1">
                {currentMessages.map((message) => (
                  <article
                    key={message.id}
                    className={`max-w-[88%] rounded-2xl p-3 text-sm ${
                      message.mine
                        ? 'ml-auto bg-[var(--color-primary-700)] text-white'
                        : 'bg-[var(--color-cream)] text-[var(--color-charcoal)]'
                    }`}
                  >
                    <div className="mb-1 flex items-center justify-between gap-3">
                      <strong>{message.author}</strong>
                      <span className={message.mine ? 'text-white/65' : 'text-[var(--color-warm-gray)]'}>
                        {message.time}
                      </span>
                    </div>
                    <p className={message.mine ? 'text-white/80' : 'text-[var(--color-warm-gray)]'}>
                      {message.role}
                    </p>
                    <p className="mt-2">{message.content}</p>
                  </article>
                ))}
              </div>
              <div className="mt-4 flex gap-2">
                <textarea
                  aria-label="Nova mensagem da tratativa"
                  className="min-h-11 flex-1 resize-none rounded-lg border border-[var(--color-cream-dark)] px-3 py-2 text-sm outline-none focus:border-[var(--color-primary-300)]"
                  placeholder="Escreva uma mensagem para alinhar data, estrutura ou transporte..."
                  value={newMessage}
                  onChange={(event) => setNewMessage(event.target.value)}
                />
                <Button aria-label="Enviar mensagem" icon={<Send className="h-4 w-4" />} onClick={sendMessage}>
                  Enviar
                </Button>
              </div>
            </section>

            <div className="flex flex-wrap gap-2">
              <Button onClick={confirmVisit} variant="secondary">
                Confirmar visita
              </Button>
              <Button onClick={includeConversationSchoolInRoute} variant="ghost">
                Incluir na rota
              </Button>
            </div>
          </div>
        ) : null}
      </Modal>

      {/* Modal de cadastro de escola */}
      <Modal open={registerOpen} title="Cadastrar escola na rede" onClose={() => setRegisterOpen(false)}>
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Nome da escola"
              onChange={(event) => setSchoolForm((current) => ({ ...current, name: event.target.value }))}
              placeholder="Ex: Escola Municipal..."
              value={schoolForm.name}
            />
            <Input label="INEP ou CNPJ" />
            <Input
              label="Município"
              onChange={(event) => setSchoolForm((current) => ({ ...current, city: event.target.value }))}
              value={schoolForm.city}
              placeholder="Ex: Caruaru"
            />
            <Input
              label="Número de alunos"
              onChange={(event) => setSchoolForm((current) => ({ ...current, students: event.target.value }))}
              type="number"
              value={schoolForm.students}
            />
            <Input label="Contato responsável" />
            <Select
              label="Faixa etária predominante"
              options={[
                { label: 'Selecione...', value: '' },
                { label: '4 a 7 anos', value: '4 a 7 anos' },
                { label: '6 a 10 anos', value: '6 a 10 anos' },
                { label: '8 a 14 anos', value: '8 a 14 anos' },
                { label: '10 a 17 anos', value: '10 a 17 anos' },
                { label: 'Todas as idades', value: 'Todas as idades' },
              ]}
              value={schoolForm.ageRange}
              onChange={(e) => setSchoolForm((f) => ({ ...f, ageRange: e.target.value }))}
            />
            <Input
              label="Estrutura disponível"
              onChange={(event) => setSchoolForm((current) => ({ ...current, structure: event.target.value }))}
              placeholder="Auditório, pátio, sala ampla..."
              value={schoolForm.structure}
            />
          </div>
          <div>
            <p className="mb-2 text-sm font-semibold">Interesse por linguagem artística</p>
            <div className="flex flex-wrap gap-2">
              {languageOptions.map((lang) => (
                <button
                  key={lang}
                  type="button"
                  className={`rounded-full px-3 py-1.5 text-sm font-semibold transition ${
                    schoolForm.interests.includes(lang)
                      ? 'bg-[var(--color-primary-700)] text-white'
                      : 'bg-[var(--color-cream)] hover:bg-[var(--color-cream-dark)]'
                  }`}
                  onClick={() => toggleInterest(lang)}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-sm font-semibold">Pode receber:</p>
            <div className="flex flex-wrap gap-2">
              {activityOptions.map((act) => (
                <button
                  key={act}
                  type="button"
                  className={`rounded-full px-3 py-1.5 text-sm font-semibold transition ${
                    schoolForm.activityTypes.includes(act)
                      ? 'bg-[var(--color-secondary-300)] text-white'
                      : 'bg-[var(--color-cream)] hover:bg-[var(--color-cream-dark)]'
                  }`}
                  onClick={() => toggleActivity(act)}
                >
                  {act}
                </button>
              ))}
            </div>
          </div>
          <Button className="mt-2" onClick={saveSchool}>
            Salvar escola
          </Button>
        </div>
      </Modal>

      {/* Modal de Kit Pedagógico */}
      <Modal open={kitOpen} title="Kit pedagógico" onClose={() => setKitOpen(false)}>
        <div className="space-y-4 text-sm">
          <p className="text-[var(--color-warm-gray)]">
            Grupos artísticos podem enviar material de apoio pedagógico para escolas da rede antes das apresentações.
          </p>
          <div className="rounded-2xl bg-[var(--color-cream)] p-4 space-y-3">
            <div>
              <p className="font-bold">A Peleja do Riso · Mamulengo Flor do Sertão</p>
              <p className="text-xs text-[var(--color-warm-gray)]">Kit enviado · Disponível para download</p>
            </div>
            <ul className="space-y-2">
              {[
                '📹 Vídeo de processo criativo (18 min)',
                '📄 Plano de aula — Cultura popular e bonecos de luva',
                '📚 Vocabulário artístico: mamulengo, esperteza popular, dramaturgia oral',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Button
              variant="secondary"
              onClick={() => toast.success('Kit baixado com sucesso.')}
            >
              Baixar kit completo
            </Button>
          </div>
          <div className="rounded-2xl border border-dashed border-[var(--color-cream-dark)] p-4 text-center text-[var(--color-warm-gray)]">
            <p className="font-semibold">Enviar novo kit</p>
            <p className="mt-1 text-xs">Arraste arquivos ou clique para selecionar (PDF, MP4, ZIP)</p>
            <Button className="mt-3" variant="secondary" onClick={() => toast.success('Kit enviado para curadoria da rede.')}>
              Selecionar arquivos
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
