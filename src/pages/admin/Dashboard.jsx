import { useState, useEffect } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts'
import api from '../../services/api'

const ESTADO_COLORS = {
  pendiente:  '#f59e0b',
  confirmada: '#3b82f6',
  completada: '#10b981',
  cancelada:  '#6b7280',
}

const PIE_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#6b7280', '#8b5cf6']

function StatCard({ label, value, sub, color = 'blue' }) {
  const colors = {
    blue:   'bg-blue-50  dark:bg-blue-950  text-blue-600  dark:text-blue-400',
    green:  'bg-green-50 dark:bg-green-950 text-green-600 dark:text-green-400',
    yellow: 'bg-yellow-50 dark:bg-yellow-950 text-yellow-600 dark:text-yellow-400',
    purple: 'bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400',
    gray:   'bg-gray-100 dark:bg-gray-800  text-gray-600  dark:text-gray-400',
    red:    'bg-red-50   dark:bg-red-950   text-red-600   dark:text-red-400',
  }
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">{label}</p>
      <p className={`text-3xl font-bold ${colors[color].split(' ').slice(2).join(' ')}`}>{value}</p>
      {sub && <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{sub}</p>}
    </div>
  )
}

function SectionCard({ title, children }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
      <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">{title}</h2>
      {children}
    </div>
  )
}

export default function Dashboard() {
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  useEffect(() => {
    api.get('/api/admin/dashboard/')
      .then(res => { setData(res.data); setLoading(false) })
      .catch(() => { setError('Error al cargar el dashboard'); setLoading(false) })
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center py-32">
      <div className="w-7 h-7 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
    </div>
  )

  if (error) return (
    <div className="flex flex-col items-center justify-center py-32 gap-3">
      <p className="text-sm text-red-500">{error}</p>
      <button onClick={() => window.location.reload()} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">Reintentar</button>
    </div>
  )

  const { resumen, usuarios_por_rol, prestaciones_por_estado, prestaciones_por_mes, top_establecimientos, ultimas_prestaciones } = data

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Dashboard</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Resumen general de la plataforma</p>
      </div>

      {/* Tarjetas principales */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Usuarios"          value={resumen.total_usuarios}         sub={`+${resumen.nuevos_este_mes} este mes`} color="blue" />
        <StatCard label="Establecimientos"  value={resumen.total_establecimientos} sub={`${resumen.total_servicios} servicios`} color="green" />
        <StatCard label="Prestaciones"      value={resumen.total_prestaciones}     sub={`${resumen.total_calificaciones} calificaciones`} color="purple" />
        <StatCard label="Calificacion prom" value={`${resumen.calificacion_promedio} ★`} sub={`${resumen.total_calificaciones} resenas`} color="yellow" />
      </div>

      {/* Fila secundaria */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Vehiculos"            value={resumen.total_vehiculos}            color="gray" />
        <StatCard label="Notif. no leidas"     value={resumen.notificaciones_no_leidas}   color="red" />
        <StatCard label="Nuevos este mes"      value={resumen.nuevos_este_mes}            color="blue" />
        <StatCard label="Total calificaciones" value={resumen.total_calificaciones}       color="green" />
      </div>

      {/* Graficas fila 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Prestaciones por mes */}
        <SectionCard title="Prestaciones por mes">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={prestaciones_por_mes} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="mes" tick={{ fontSize: 11, fill: '#9ca3af' }} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} allowDecimals={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#f9fafb', fontSize: '12px' }}
                cursor={{ fill: 'rgba(59,130,246,0.08)' }}
              />
              <Bar dataKey="total" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Prestaciones" />
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>

        {/* Distribucion de estados */}
        <SectionCard title="Distribucion de estados">
          {prestaciones_por_estado.length === 0 ? (
            <div className="flex items-center justify-center h-52 text-sm text-gray-400">Sin datos</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={prestaciones_por_estado}
                  dataKey="total"
                  nameKey="estado"
                  cx="50%" cy="50%"
                  outerRadius={80}
                  label={({ estado, percent }) => `${estado} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {prestaciones_por_estado.map((entry, i) => (
                    <Cell key={i} fill={ESTADO_COLORS[entry.estado] ?? PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#f9fafb', fontSize: '12px' }}
                />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </SectionCard>

      </div>

      {/* Graficas fila 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Usuarios por rol */}
        <SectionCard title="Usuarios por rol">
          {usuarios_por_rol.length === 0 ? (
            <div className="flex items-center justify-center h-40 text-sm text-gray-400">Sin datos</div>
          ) : (
            <div className="flex flex-col gap-3 mt-2">
              {usuarios_por_rol.map((r, i) => {
                const max = Math.max(...usuarios_por_rol.map(x => x.total))
                const pct = Math.round((r.total / max) * 100)
                return (
                  <div key={i}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-700 dark:text-gray-300 font-medium">{r.rol__nombre ?? 'Sin rol'}</span>
                      <span className="text-gray-500 dark:text-gray-400">{r.total} usuarios</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-gray-100 dark:bg-gray-800">
                      <div className="h-2 rounded-full bg-blue-500 transition-all duration-500" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </SectionCard>

        {/* Top establecimientos */}
        <SectionCard title="Top establecimientos por calificacion">
          {top_establecimientos.length === 0 ? (
            <div className="flex items-center justify-center h-40 text-sm text-gray-400">Sin calificaciones aun</div>
          ) : (
            <div className="flex flex-col gap-3 mt-1">
              {top_establecimientos.map((e, i) => (
                <div key={e.id} className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 text-xs font-bold flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">{e.nombre}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">{e.total_citas} citas</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="text-yellow-400 text-sm">★</span>
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      {parseFloat(e.promedio).toFixed(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>

      </div>

      {/* Ultimas prestaciones */}
      <SectionCard title="Ultimas prestaciones">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide border-b border-gray-100 dark:border-gray-800">
                <th className="pb-3 text-left font-medium">#</th>
                <th className="pb-3 text-left font-medium">Usuario</th>
                <th className="pb-3 text-left font-medium">Establecimiento</th>
                <th className="pb-3 text-left font-medium">Servicio</th>
                <th className="pb-3 text-left font-medium">Fecha</th>
                <th className="pb-3 text-left font-medium">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {ultimas_prestaciones.length === 0 ? (
                <tr><td colSpan={6} className="py-8 text-center text-gray-400 text-xs">Sin prestaciones aun</td></tr>
              ) : ultimas_prestaciones.map(p => (
                <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <td className="py-3 text-xs text-gray-400 dark:text-gray-500">#{p.id}</td>
                  <td className="py-3 text-gray-700 dark:text-gray-300">{p.usuario__username}</td>
                  <td className="py-3 text-gray-700 dark:text-gray-300 max-w-xs truncate">{p.establecimiento__nombre}</td>
                  <td className="py-3 text-gray-700 dark:text-gray-300">{p.servicio__nombre ?? '-'}</td>
                  <td className="py-3 text-gray-500 dark:text-gray-400 text-xs">{p.fecha}</td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      p.estado === 'completada' ? 'bg-green-50 dark:bg-green-950 text-green-600 dark:text-green-400' :
                      p.estado === 'confirmada' ? 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400' :
                      p.estado === 'pendiente'  ? 'bg-yellow-50 dark:bg-yellow-950 text-yellow-600 dark:text-yellow-400' :
                      'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                    }`}>
                      {p.estado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

    </div>
  )
}