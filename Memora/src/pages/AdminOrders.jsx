import { useEffect, useState } from 'react'
import { adminGetOrders, adminUpdateOrder } from '../features/admin/admin.orders.service'

const STATUS = ['SIN_PAGAR','PAGADO','PAGADO_ENTREGADO']

export default function AdminOrders() {
  const [rows, setRows] = useState([])
  const [err, setErr] = useState('')
  const [saving, setSaving] = useState(null) // id del que guarda

  const load = () => adminGetOrders().then(setRows).catch(e => setErr(e.message))
  useEffect(() => { load() }, [])

  async function onChangeStatus(rowId, order_status) {
    try {
      setSaving(rowId)
      await adminUpdateOrder(rowId, { order_status })
      await load()
    } catch (e) {
      alert(e.message)
    } finally {
      setSaving(null)
    }
  }

  if (err) return <div className="p-6 text-red-600">{err}</div>

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Pedidos</h1>
      <div className="overflow-x-auto border rounded">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <Th>Folio</Th>
              <Th>Fecha</Th>
              <Th>Cliente</Th>
              <Th>Producto</Th>
              <Th>Importe</Th>
              <Th>Estado</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.id} className="border-t">
                <Td>{r.public_id}</Td>
                <Td>{new Date(r.created_at).toLocaleString()}</Td>
                <Td>{r.profiles?.nombre_completo ?? r.user_id}</Td>
                <Td>{r.ataudes?.nombre ?? r.ataud_id}</Td>
                <Td>${Number(r.precio_unitario||0) * Number(r.cantidad||1)}</Td>
                <Td>
                  <select
                    className="border rounded px-2 py-1"
                    value={r.order_status}
                    disabled={saving === r.id}
                    onChange={e => onChangeStatus(r.id, e.target.value)}
                  >
                    {STATUS.map(s => <option key={s} value={s}>{s.replaceAll('_',' ')}</option>)}
                  </select>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function Th({children}){ return <th className="text-left px-4 py-2">{children}</th> }
function Td({children}){ return <td className="px-4 py-2">{children}</td> }
