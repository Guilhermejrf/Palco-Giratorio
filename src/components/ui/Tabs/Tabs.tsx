interface TabsProps {
  tabs: string[]
  active: string
  onChange: (tab: string) => void
}

export const Tabs = ({ tabs, active, onChange }: TabsProps) => (
  <div className="inline-flex rounded-xl border border-[var(--color-cream-dark)] bg-white p-1">
    {tabs.map((tab) => (
      <button
        key={tab}
        className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
          active === tab
            ? 'bg-[var(--color-primary-700)] text-white'
            : 'text-[var(--color-warm-gray)] hover:bg-[var(--color-cream)]'
        }`}
        onClick={() => onChange(tab)}
        type="button"
      >
        {tab}
      </button>
    ))}
  </div>
)
