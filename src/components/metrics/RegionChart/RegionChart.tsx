import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { regionMetrics } from '../../../constants/mockData'

export const RegionChart = () => (
  <div className="h-72">
    <ResponsiveContainer height="100%" width="100%">
      <BarChart data={regionMetrics}>
        <CartesianGrid stroke="var(--color-cream-dark)" vertical={false} />
        <XAxis dataKey="region" fontSize={11} tickLine={false} />
        <YAxis fontSize={11} tickLine={false} />
        <Tooltip />
        <Bar dataKey="presentations" fill="var(--color-secondary-300)" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  </div>
)
