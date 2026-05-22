import { Navigate, createBrowserRouter } from 'react-router-dom'
import { AppLayout } from '../components/layout/AppLayout'
import { Login } from '../pages/Auth/Login/Login'
import { Register } from '../pages/Auth/Register/Register'
import { CircuitoDetail } from '../pages/Circuitos/CircuitoDetail/CircuitoDetail'
import { CircuitoNew } from '../pages/Circuitos/CircuitoNew/CircuitoNew'
import { CircuitosList } from '../pages/Circuitos/CircuitosList/CircuitosList'
import { Dashboard } from '../pages/Dashboard/Dashboard'
import { Demo } from '../pages/Demo/Demo'
import { Escolas } from '../pages/Escolas/Escolas'
import { EspetaculoDetail } from '../pages/Espetaculos/EspetaculoDetail/EspetaculoDetail'
import { EspetaculosList } from '../pages/Espetaculos/EspetaculosList/EspetaculosList'
import { Logistica } from '../pages/Logistica/Logistica'
import { MapaVivoPage } from '../pages/MapaVivo/MapaVivoPage'
import { Metricas } from '../pages/Metricas/Metricas'
import { Recursos } from '../pages/Recursos/Recursos'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'mapa', element: <MapaVivoPage /> },
      { path: 'espetaculos', element: <EspetaculosList /> },
      { path: 'espetaculos/:id', element: <EspetaculoDetail /> },
      { path: 'circuitos', element: <CircuitosList /> },
      { path: 'circuitos/novo', element: <CircuitoNew /> },
      { path: 'circuitos/:id', element: <CircuitoDetail /> },
      { path: 'recursos', element: <Recursos /> },
      { path: 'escolas', element: <Escolas /> },
      { path: 'metricas', element: <Metricas /> },
      { path: 'logistica', element: <Logistica /> },
      { path: 'perfil', element: <Navigate to="/" replace /> },
    ],
  },
  { path: '/login', element: <Login /> },
  { path: '/cadastro', element: <Register /> },
  { path: '/demo', element: <Demo /> },
])
