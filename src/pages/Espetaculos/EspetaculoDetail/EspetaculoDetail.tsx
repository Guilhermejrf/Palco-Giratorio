import { useParams } from 'react-router-dom'
import { PageHeader } from '../../../components/layout/PageHeader/PageHeader'
import { RiderDigital } from '../../../components/shows/RiderDigital/RiderDigital'
import { shows } from '../../../constants/mockData'

export const EspetaculoDetail = () => {
  const { id } = useParams()
  const show = shows.find((item) => item.id === id) ?? shows[0]
  return (
    <div>
      <PageHeader title={show.name} subtitle={`${show.group} · ${show.originCity}`} />
      <div className="p-4 md:p-8">
        <RiderDigital open show={show} onClose={() => window.history.back()} />
      </div>
    </div>
  )
}
