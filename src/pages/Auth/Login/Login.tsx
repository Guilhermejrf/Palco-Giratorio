import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../../../components/ui/Button/Button'
import { DecorativeShape } from '../../../components/ui/DecorativeShape/DecorativeShape'
import { Input } from '../../../components/ui/Input/Input'
import { useAuthStore } from '../../../stores/authStore'

interface LoginValues {
  email: string
  password: string
}

export const Login = () => {
  const { register, handleSubmit } = useForm<LoginValues>({
    defaultValues: { email: 'lucas@sescpe.org.br', password: 'demo123' },
  })
  const login = useAuthStore((state) => state.login)
  const navigate = useNavigate()

  const submit = async (values: LoginValues) => {
    await login(values.email, values.password)
    navigate('/')
  }

  return (
    <main className="grid min-h-screen md:grid-cols-2">
      <section className="relative overflow-hidden bg-[var(--color-primary-700)] p-8 text-white">
        <DecorativeShape shape="star" color="var(--color-secondary-200)" className="-right-16 top-12" />
        <DecorativeShape shape="eye" color="var(--color-primary-200)" className="-bottom-16 left-10" />
        <h1 className="relative z-10 font-display text-3xl md:text-[52px]">Cena Acesa PE</h1>
        <p className="relative z-10 mt-4 max-w-md text-white/75">
          Quando uma cidade recebe cena, ela acende no mapa. Quando várias acendem juntas, nasce um circuito.
        </p>
      </section>
      <section className="flex items-center justify-center p-6">
        <form className="w-full max-w-md space-y-4 rounded-3xl bg-white p-6 shadow-soft" onSubmit={handleSubmit(submit)}>
          <h2 className="font-display text-2xl">Entrar</h2>
          <Input label="E-mail" type="email" {...register('email')} />
          <Input label="Senha" type="password" {...register('password')} />
          <Button className="w-full" type="submit">
            Entrar
          </Button>
          <div className="flex justify-between text-sm text-[var(--color-warm-gray)]">
            <a href="#recuperar">Esqueci minha senha</a>
            <Link to="/cadastro">Sou novo aqui</Link>
          </div>
        </form>
      </section>
    </main>
  )
}
