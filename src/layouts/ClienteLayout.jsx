import { Outlet } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useTheme } from '../context/ThemeContext'

export default function ClienteLayout() {
  const { dark } = useTheme()

  return (
    <div
      className="min-h-screen flex flex-col bg-white dark:bg-gray-950 bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: dark
          ? 'url(/img/Fondo_oscuro.jpg)'
          : 'url(/img/Fondo_claro.png)',
      }}
    >
      {/* Overlay para legibilidad */}
      <div className="min-h-screen flex flex-col bg-white/1 dark:bg-gray-950/70">
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  )
}