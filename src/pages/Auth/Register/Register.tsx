import { useState } from 'react'
import toast from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../../../components/ui/Button/Button'
import { Input } from '../../../components/ui/Input/Input'

const profiles = ['Artista/Grupo', 'Técnico', 'Gestor Sesc', 'Escola', 'Espaço Cultural']

export const Register = () => {
  const [profile, setProfile] = useState(profiles[0])
  const navigate = useNavigate()

  const confirmRegister = () => {
    toast.success(`Cadastro de ${profile} iniciado. Verifique o e-mail de confirmação.`)
    navigate('/login')
  }

  return (
    <main className="min-h-screen p-6">
      <div className="mx-auto max-w-3xl rounded-3xl bg-white p-6 shadow-soft">
        <h1 className="font-display text-3xl">Cadastro</h1>
        <p className="mb-6 text-sm text-[var(--color-warm-gray)]">Escolha seu perfil e complete os dados básicos.</p>
        <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {profiles.map((item) => (
            <button
              key={item}
              className={`rounded-2xl border p-3 text-sm font-bold ${profile === item ? 'border-[var(--color-secondary-300)] bg-[var(--color-secondary-50)]' : 'border-[var(--color-cream-dark)]'}`}
              onClick={() => setProfile(item)}
              type="button"
            >
              {item}
            </button>
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Input label="Nome" />
          <Input label="E-mail" type="email" />
          <Input label="Senha" type="password" />
          <Input label={profile === 'Escola' ? 'INEP' : 'Telefone'} />
        </div>
        <div className="mt-6 flex items-center gap-3">
          <Button onClick={confirmRegister}>Confirmar cadastro</Button>
          <Link className="text-sm font-bold text-[var(--color-secondary-500)]" to="/login">
            Voltar ao login
          </Link>
        </div>
      </div>
    </main>
  )
}
