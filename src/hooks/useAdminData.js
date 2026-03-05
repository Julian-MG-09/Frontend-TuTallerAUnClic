import { useState, useEffect } from 'react'

export function useAdminData(fetchFn) {
  const [data, setData]       = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetchFn()
      setData(Array.isArray(res.data) ? res.data : res.data.results ?? [])
    } catch {
      setError('Error al cargar los datos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  return { data, setData, loading, error, reload: load }
}