import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix icono por defecto de leaflet con vite
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

function ClickHandler({ onSelect }) {
  useMapEvents({
    click(e) {
      onSelect(e.latlng.lat, e.latlng.lng)
    }
  })
  return null
}

export default function MapPicker({ lat, lng, onChange }) {
  const [query, setQuery]       = useState('')
  const [searching, setSearching] = useState(false)

  const position = lat && lng
    ? [parseFloat(lat), parseFloat(lng)]
    : [4.6097, -74.0817] // Bogotá por defecto

  async function handleSearch() {
    if (!query.trim()) return
    setSearching(true)
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`,
        { headers: { 'Accept-Language': 'es' } }
      )
      const data = await res.json()
      if (data.length > 0) {
        onChange(parseFloat(data[0].lat), parseFloat(data[0].lon))
      } else {
        alert('No se encontro la direccion')
      }
    } catch {
      alert('Error al buscar la direccion')
    } finally {
      setSearching(false)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {/* Buscador */}
      <div className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
          placeholder="Buscar direccion..."
          className="flex-1 px-3 py-2 text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSearch}
          disabled={searching}
          className="px-3 py-2 text-sm rounded-md bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white transition-colors flex items-center gap-1.5"
        >
          {searching
            ? <span className="w-3 h-3 rounded-full border-2 border-white border-t-transparent animate-spin" />
            : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" /></svg>
          }
          Buscar
        </button>
      </div>

      {/* Mapa */}
      <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700" style={{ height: '280px' }}>
        <MapContainer
          center={position}
          zoom={lat && lng ? 15 : 12}
          style={{ height: '100%', width: '100%' }}
          key={`${lat}-${lng}`}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a>'
          />
          <ClickHandler onSelect={onChange} />
          {lat && lng && <Marker position={[parseFloat(lat), parseFloat(lng)]} />}
        </MapContainer>
      </div>

      <p className="text-xs text-gray-400 dark:text-gray-500">
        Haz clic en el mapa o busca una direccion para seleccionar la ubicacion
      </p>

      {/* Coordenadas actuales */}
      {lat && lng && (
        <div className="flex gap-3">
          <div className="flex-1 px-3 py-2 text-xs rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
            Lat: <span className="font-mono font-medium text-gray-800 dark:text-gray-100">{parseFloat(lat).toFixed(6)}</span>
          </div>
          <div className="flex-1 px-3 py-2 text-xs rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
            Lng: <span className="font-mono font-medium text-gray-800 dark:text-gray-100">{parseFloat(lng).toFixed(6)}</span>
          </div>
        </div>
      )}
    </div>
  )
}