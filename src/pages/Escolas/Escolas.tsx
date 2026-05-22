import { useState } from 'react'
import toast from 'react-hot-toast'
import { PageHeader } from '../../components/layout/PageHeader/PageHeader'
import { SchoolCard } from '../../components/schools/SchoolCard/SchoolCard'
import { Button } from '../../components/ui/Button/Button'
import { Input } from '../../components/ui/Input/Input'
import { Modal } from '../../components/ui/Modal/Modal'
import { useDemoDataStore } from '../../stores/demoDataStore'

export const Escolas = () => {
  const [onlyNeverServed, setOnlyNeverServed] = useState(false)
  const [registerOpen, setRegisterOpen] = useState(false)
  const [schoolForm, setSchoolForm] = useState({ name: '', city: '', students: '', structure: '' })
  const schools = useDemoDataStore((state) => state.schools)
  const addSchool = useDemoDataStore((state) => state.addSchool)
  const visibleSchools = onlyNeverServed ? schools.filter((school) => school.neverServed) : schools

  const saveSchool = () => {
    addSchool({
      name: schoolForm.name || 'Nova escola da rede',
      city: schoolForm.city || 'Recife',
      students: Number(schoolForm.students) || 120,
      structure: schoolForm.structure || 'Espaco multiuso',
    })
    toast.success('Escola cadastrada e marcada para curadoria da rede.')
    setSchoolForm({ name: '', city: '', students: '', structure: '' })
    setRegisterOpen(false)
  }

  return (
    <div>
      <PageHeader
        title="Escolas"
        subtitle="Escolas da rede para acoes formativas, apresentacoes diurnas e rotas ampliadas."
        decorativeShape="star"
        decorativeColor="var(--color-primary-100)"
        actions={<Button onClick={() => setRegisterOpen(true)}>Cadastrar escola</Button>}
      />
      <div className="space-y-5 p-4 md:p-8">
        <div className="flex flex-wrap gap-2">
          {['Regiao', 'Faixa etaria', 'Estrutura'].map((filter) => (
            <button
              key={filter}
              className="rounded-full bg-white px-3 py-2 text-sm font-semibold"
              onClick={() => toast(`${filter}: filtro aplicado na demo.`)}
              type="button"
            >
              {filter}
            </button>
          ))}
          <button
            className={`rounded-full px-3 py-2 text-sm font-semibold ${
              onlyNeverServed ? 'bg-[var(--color-primary-700)] text-white' : 'bg-white'
            }`}
            onClick={() => setOnlyNeverServed((value) => !value)}
            type="button"
          >
            Nunca atendidas
          </button>
        </div>
        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {visibleSchools.map((school) => (
            <SchoolCard key={school.id} school={school} />
          ))}
        </div>
      </div>
      <Modal open={registerOpen} title="Cadastrar escola" onClose={() => setRegisterOpen(false)}>
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Nome da escola"
            onChange={(event) => setSchoolForm((current) => ({ ...current, name: event.target.value }))}
            placeholder="Ex: Escola Municipal..."
            value={schoolForm.name}
          />
          <Input label="INEP ou CNPJ" />
          <Input
            label="Municipio"
            onChange={(event) => setSchoolForm((current) => ({ ...current, city: event.target.value }))}
            value={schoolForm.city}
          />
          <Input
            label="Numero de alunos"
            onChange={(event) => setSchoolForm((current) => ({ ...current, students: event.target.value }))}
            type="number"
            value={schoolForm.students}
          />
          <Input label="Contato responsavel" />
          <Input
            label="Estrutura disponivel"
            onChange={(event) => setSchoolForm((current) => ({ ...current, structure: event.target.value }))}
            placeholder="Auditorio, patio, sala ampla..."
            value={schoolForm.structure}
          />
        </div>
        <Button className="mt-5" onClick={saveSchool}>
          Salvar escola
        </Button>
      </Modal>
    </div>
  )
}
