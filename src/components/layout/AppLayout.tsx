import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar/Sidebar'
import { Header } from './Header/Header'
import { Footer } from './Footer/Footer'
import { BottomNav } from './BottomNav'
import { useUIStore } from '../../stores/uiStore'

export const AppLayout = () => {
  const collapsed = useUIStore((state) => state.sidebarCollapsed)
  return (
    <>
      <a className="skip-link" href="#main-content">
        Ir para o conteúdo principal
      </a>
      <Sidebar />
      <div className={`min-h-screen pb-16 transition-all md:pb-0 ${collapsed ? 'md:ml-16' : 'md:ml-60'}`}>
        <Header />
        <main id="main-content">
          <Outlet />
        </main>
        <Footer />
      </div>
      <BottomNav />
    </>
  )
}
