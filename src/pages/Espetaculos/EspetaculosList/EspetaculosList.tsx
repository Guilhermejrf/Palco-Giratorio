import { Plus } from 'lucide-react'
import { useState } from 'react'
import { ShowCard } from '../../../components/shows/ShowCard/ShowCard'
import { ShowForm } from '../../../components/shows/ShowForm/ShowForm'
import { RiderDigital } from '../../../components/shows/RiderDigital/RiderDigital'
import { Button } from '../../../components/ui/Button/Button'
import { Modal } from '../../../components/ui/Modal/Modal'
import { PageHeader } from '../../../components/layout/PageHeader/PageHeader'
import { LANGUAGES } from '../../../constants/languages'
import { shows } from '../../../constants/mockData'
import type { Show } from '../../../types/show.types'

export const EspetaculosList = () => {
  const [selectedShow, setSelectedShow] = useState<Show | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [language, setLanguage] = useState('')
  const filteredShows = language ? shows.filter((show) => show.languages.includes(language as Show['languages'][number])) : shows

  return (
    <div>
      <PageHeader
        title="Espetáculos"
        subtitle={`${shows.length} trabalhos cadastrados com riders, disponibilidade e oficinas integradas.`}
        decorativeShape="star"
        decorativeColor="var(--color-accent-100)"
        actions={
          <Button icon={<Plus className="h-4 w-4" />} onClick={() => setFormOpen(true)}>
            Cadastrar espetáculo
          </Button>
        }
      />
      <div className="space-y-5 p-4 md:p-8">
        <div className="flex flex-wrap gap-2">
          <button
            className={`rounded-full px-3 py-2 text-sm font-semibold ${!language ? 'bg-[var(--color-primary-700)] text-white' : 'bg-white'}`}
            onClick={() => setLanguage('')}
            type="button"
          >
            Todos
          </button>
          {LANGUAGES.map((item) => (
            <button
              key={item}
              className={`rounded-full px-3 py-2 text-sm font-semibold ${language === item ? 'bg-[var(--color-primary-700)] text-white' : 'bg-white'}`}
              onClick={() => setLanguage(item)}
              type="button"
            >
              {item}
            </button>
          ))}
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredShows.map((show) => (
            <ShowCard key={show.id} show={show} onRider={setSelectedShow} />
          ))}
        </div>
      </div>
      <RiderDigital open={Boolean(selectedShow)} show={selectedShow} onClose={() => setSelectedShow(null)} />
      <Modal open={formOpen} title="Cadastrar espetáculo" onClose={() => setFormOpen(false)}>
        <ShowForm />
      </Modal>
    </div>
  )
}
