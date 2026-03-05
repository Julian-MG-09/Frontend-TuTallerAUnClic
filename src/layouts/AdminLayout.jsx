import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import TopBar from '../components/TopBar'

export default function AdminLayout() {
  const [open, setOpen] = useState(true)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <Sidebar open={open} />
      <TopBar open={open} setOpen={setOpen} />

      <main
        className="pt-16 transition-all duration-300 min-h-screen"
        style={{ marginLeft: open ? '14rem' : '4rem' }}
      >
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  )
}