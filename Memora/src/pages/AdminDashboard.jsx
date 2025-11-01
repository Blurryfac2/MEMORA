import { useEffect, useState } from 'react'
import { adminGetStats } from '../features/admin/admin.orders.service'

const money = n => new Intl.NumberFormat('es-MX',{style:'currency',currency:'MXN'}).format(Number(n||0))

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [err, setErr] = useState('')

  useEffect(() => {
    adminGetStats().then(setStats).catch(e=>setErr(e.message))
  }, [])

  if (err) return <div className="p-6 text-red-600">{err}</div>
  if (!stats) return <div className="p-6">Cargando…</div>

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Panel de Administración</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card title="Pedidos" value={stats.total} />
        <Card title="Sin pagar" value={stats.sinPagar} />
        <Card title="Pagados" value={stats.pagado} />
        <Card title="Entregados" value={stats.entregado} />
        <Card title="Ingreso" value={money(stats.ingreso)} />
      </div>
    </div>
  )
}

function Card({ title, value }) {
  return (
    <div className="rounded-xl border p-4">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="text-2xl font-semibold">{value}</div>
    </div>
  )
}
