// src/pages/Payment.jsx
import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { getOrderByPublicId } from '../features/orders/orders.service.js'

const BANK = {
  banco: 'BBVA',
  titular: 'Juan Pérez',
  cuenta: '0123456789',
  clabe: '012345678901234567',
  referencia: 'ETHR-COFFINS'
}

// 💰 Formatear dinero en pesos MXN
function moneyMX(n) {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' })
    .format(Number(n || 0))
}

export default function Payment() {
  const [sp] = useSearchParams()
  const pid = sp.get('pid') || ''
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')

  useEffect(() => {
    if (!pid) {
      setErr('Falta el folio del pedido.')
      setLoading(false)
      return
    }
    getOrderByPublicId(pid)
      .then(setOrder)
      .catch(e => setErr(e.message))
      .finally(() => setLoading(false))
  }, [pid])

  if (loading) return <div className="max-w-3xl mx-auto py-10">Cargando…</div>
  if (err) return <div className="max-w-3xl mx-auto py-10 text-red-600">{err}</div>
  if (!order) return <div className="max-w-3xl mx-auto py-10">No se encontró el pedido.</div>

  // 🧮 Cálculos seguros
  const cantidad = order.cantidad ?? 1
  const precioUnit = order.precio_unitario ?? order.ataudes?.precio ?? 0
  const total = Number(precioUnit) * Number(cantidad)

  // 🟢 Estado legible + badge
  const status = String(order.order_status || '').toUpperCase()

  const LEGIBLE = {
    SIN_PAGAR: 'Sin pagar',
    PAGADO: 'Pagado',
    PAGADO_ENTREGADO: 'Pagado y entregado'
  }

  const BADGE = {
    SIN_PAGAR: 'bg-yellow-100 text-yellow-800',
    PAGADO: 'bg-blue-100 text-blue-700',
    PAGADO_ENTREGADO: 'bg-green-100 text-green-700'
  }

  const estadoLegible =
    (LEGIBLE[status] ??
    status.replaceAll('_', ' ').toLowerCase().replace(/(^|\s)\S/g, m => m.toUpperCase())) ||
    'Sin pagar'

  const stateClass = BADGE[status] ?? BADGE.SIN_PAGAR

  return (
    <div className="max-w-3xl mx-auto py-10 space-y-8">
      <h1 className="text-3xl font-semibold">Pago por Depósito</h1>
      <p className="text-sm text-gray-600">
        Folio: <strong>{order.public_id}</strong>
      </p>

      {/* 🧾 Resumen del pedido */}
      <section className="border rounded p-5">
        <h2 className="text-xl font-semibold mb-3">Resumen del pedido</h2>
        <ul className="text-sm space-y-1">
          <li>
            Producto:{' '}
            <strong>{order.ataudes?.nombre ?? order.ataud_id}</strong>
          </li>
          <li>
            Cantidad: <strong>{cantidad}</strong>
          </li>
          <li>
            Importe:{' '}
            <strong>{moneyMX(total)}</strong>{' '}
            <span className="text-gray-500">
              ({cantidad} × {moneyMX(precioUnit)})
            </span>
          </li>
          <li>
            Estado actual:{' '}
            <span
              className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${stateClass}`}
            >
              {estadoLegible}
            </span>
          </li>
          <li>Fecha: {new Date(order.created_at).toLocaleString()}</li>
        </ul>
      </section>

      {/* 🏦 Datos bancarios */}
      <section className="border rounded p-5">
        <h2 className="text-xl font-semibold mb-3">Datos bancarios</h2>
        <div className="grid sm:grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-gray-500">Banco:</span>{' '}
            <strong>{BANK.banco}</strong>
          </div>
          <div>
            <span className="text-gray-500">Titular:</span>{' '}
            <strong>{BANK.titular}</strong>
          </div>
          <div>
            <span className="text-gray-500">Cuenta:</span>{' '}
            <strong>{BANK.cuenta}</strong>
          </div>
          <div>
            <span className="text-gray-500">CLABE:</span>{' '}
            <strong>{BANK.clabe}</strong>
          </div>
          <div className="sm:col-span-2">
            <span className="text-gray-500">Referencia:</span>{' '}
            <strong>
              {BANK.referencia} / {order.public_id}
            </strong>
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-3">
          Usa tu <strong>folio</strong> como referencia. Después del depósito,
          envíanos el comprobante por WhatsApp o correo.
        </p>
      </section>

      {/* 📩 Acciones */}
      <div className="flex gap-3 text-sm">
        <a
          className="bg-green-600 text-white px-4 py-2 rounded"
          href={`https://wa.me/52XXXXXXXXXX?text=Comprobante%20del%20pedido%20${encodeURIComponent(
            order.public_id
          )}`}
          target="_blank"
          rel="noreferrer"
        >
          Enviar por WhatsApp
        </a>
        <Link className="underline text-gray-700" to="/cuenta">
          Volver a mi cuenta
        </Link>
      </div>
    </div>
  )
}
