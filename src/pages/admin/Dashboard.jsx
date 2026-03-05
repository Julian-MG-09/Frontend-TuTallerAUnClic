const STATS = [
  { label: 'Usuarios registrados', value: '1,284', delta: '+12% este mes',    positive: true  },
  { label: 'Establecimientos',     value: '87',    delta: '+3 nuevos',         positive: true  },
  { label: 'Prestaciones activas', value: '342',   delta: '+8% esta semana',   positive: true  },
  { label: 'Calificacion promedio',value: '4.3',   delta: '-0.1 vs mes anterior', positive: false },
]

const PRESTACIONES_RECIENTES = [
  { id: 1, usuario: 'carlos123',  establecimiento: 'Taller El Rapido',    servicio: 'Cambio de aceite', fecha: '2025-03-10', estado: 'pendiente'  },
  { id: 2, usuario: 'maria_e',    establecimiento: 'AutoServicios Norte', servicio: 'Diagnostico',      fecha: '2025-03-11', estado: 'confirmada' },
  { id: 3, usuario: 'laura.p',    establecimiento: 'Taller El Rapido',    servicio: 'Frenos',           fecha: '2025-03-11', estado: 'completada' },
  { id: 4, usuario: 'jorge.m',    establecimiento: 'AutoServicios Norte', servicio: 'Suspension',       fecha: '2025-03-12', estado: 'cancelada'  },
  { id: 5, usuario: 'ana.torres', establecimiento: 'Taller El Rapido',    servicio: 'Alineacion',       fecha: '2025-03-12', estado: 'pendiente'  },
]

const ESTABLECIMIENTOS_TOP = [
  { nombre: 'Taller El Rapido',    calificacion: 4.8, total_citas: 128, tipo: 'Mecanica'     },
  { nombre: 'AutoServicios Norte', calificacion: 4.5, total_citas: 97,  tipo: 'Electricidad' },
  { nombre: 'Frenos Express',      calificacion: 4.2, total_citas: 74,  tipo: 'Frenos'       },
  { nombre: 'Latoneria Pro',       calificacion: 4.0, total_citas: 55,  tipo: 'Latoneria'    },
]

const ESTADO_STYLES = {
  pendiente:  'bg-yellow-50 dark:bg-yellow-950 text-yellow-600 dark:text-yellow-400',
  confirmada: 'bg-blue-50  dark:bg-blue-950  text-blue-600  dark:text-blue-400',
  completada: 'bg-green-50 dark:bg-green-950 text-green-600 dark:text-green-400',
  cancelada:  'bg-gray-100 dark:bg-gray-800  text-gray-500  dark:text-gray-400',
}

// Grafico de barras simple con CSS
const BARRAS_MES = [
  { mes: 'Oct', value: 68  },
  { mes: 'Nov', value: 95  },
  { mes: 'Dic', value: 72  },
  { mes: 'Ene', value: 110 },
  { mes: 'Feb', value: 130 },
  { mes: 'Mar', value: 98  },
]

const MAX_VALUE = Math.max(...BARRAS_MES.map(b => b.value))

export default function Dashboard() {
  return (
    <div className="space-y-6">

      {/* Cabecera */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Dashboard</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          Resumen general de la plataforma Tu Taller a un Clic
        </p>
      </div>

      {/* Tarjetas de estadisticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {STATS.map(stat => (
          <div
            key={stat.label}
            className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 px-5 py-4"
          >
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
              {stat.label}
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
              {stat.value}
            </p>
            <p className={`text-xs font-medium ${stat.positive ? 'text-green-500' : 'text-red-400'}`}>
              {stat.delta}
            </p>
          </div>
        ))}
      </div>

      {/* Fila central: grafico + establecimientos top */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Grafico de prestaciones por mes */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 px-5 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                Prestaciones por mes
              </h2>
              <p className="text-xs text-gray-400 dark:text-gray-500">Ultimos 6 meses</p>
            </div>
            <span className="text-xs px-2 py-1 rounded bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-medium">
              573 total
            </span>
          </div>

          {/* Barras */}
          <div className="flex items-end gap-3 h-36">
            {BARRAS_MES.map(b => (
              <div key={b.mes} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs text-gray-500 dark:text-gray-400">{b.value}</span>
                <div
                  className="w-full rounded-t-sm bg-blue-500 dark:bg-blue-600 transition-all"
                  style={{ height: `${(b.value / MAX_VALUE) * 100}%` }}
                />
                <span className="text-xs text-gray-400 dark:text-gray-500">{b.mes}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Establecimientos top */}
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 px-5 py-4">
          <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-4">
            Establecimientos mejor calificados
          </h2>
          <div className="space-y-3">
            {ESTABLECIMIENTOS_TOP.map((est, i) => (
              <div key={est.nombre} className="flex items-center gap-3">
                <span className="text-xs font-bold text-gray-400 dark:text-gray-500 w-4 shrink-0">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">
                    {est.nombre}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    {est.total_citas} citas · {est.tipo}
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <span className="text-yellow-400 text-xs">★</span>
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {est.calificacion}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Distribucion de estados */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 px-5 py-4">
          <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-4">
            Estado de prestaciones
          </h2>
          <div className="space-y-3">
            {[
              { label: 'Completadas', value: 198, total: 342, color: 'bg-green-500' },
              { label: 'Confirmadas', value: 89,  total: 342, color: 'bg-blue-500'  },
              { label: 'Pendientes',  value: 43,  total: 342, color: 'bg-yellow-400'},
              { label: 'Canceladas',  value: 12,  total: 342, color: 'bg-gray-300 dark:bg-gray-600'  },
            ].map(item => (
              <div key={item.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-600 dark:text-gray-400">{item.label}</span>
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    {item.value} ({Math.round((item.value / item.total) * 100)}%)
                  </span>
                </div>
                <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${item.color}`}
                    style={{ width: `${(item.value / item.total) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Prestaciones recientes */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 px-5 py-4">
          <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-4">
            Prestaciones recientes
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide">
                  <th className="pb-2 text-left">Usuario</th>
                  <th className="pb-2 text-left">Establecimiento</th>
                  <th className="pb-2 text-left hidden sm:table-cell">Servicio</th>
                  <th className="pb-2 text-left hidden sm:table-cell">Fecha</th>
                  <th className="pb-2 text-left">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {PRESTACIONES_RECIENTES.map(p => (
                  <tr key={p.id}>
                    <td className="py-2.5 text-gray-800 dark:text-gray-100 font-medium">{p.usuario}</td>
                    <td className="py-2.5 text-gray-600 dark:text-gray-400 truncate max-w-xs">{p.establecimiento}</td>
                    <td className="py-2.5 text-gray-600 dark:text-gray-400 hidden sm:table-cell">{p.servicio}</td>
                    <td className="py-2.5 text-gray-500 dark:text-gray-500 hidden sm:table-cell">{p.fecha}</td>
                    <td className="py-2.5">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${ESTADO_STYLES[p.estado]}`}>
                        {p.estado.charAt(0).toUpperCase() + p.estado.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  )
}