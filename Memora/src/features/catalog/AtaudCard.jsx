import PropTypes from 'prop-types'

// 💰 Formateador reutilizable para precios
const money = (v) =>
  new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' })
    .format(Number(v ?? 0))

export default function AtaudCard({ ataud, onView }) {
  return (
    <article className="rounded-2xl border shadow-sm overflow-hidden">
      <div className="h-48 bg-slate-100" />
      <div className="p-4">
        <h3 className="font-semibold">{ataud?.nombre}</h3>

        {/* ✅ Muestra correctamente el precio */}
        <p className="text-orange-600 font-semibold">{money(ataud?.precio)}</p>

        <button
          className="mt-3 w-full rounded-lg bg-slate-900 text-white py-2"
          onClick={() => onView?.(ataud)}
        >
          Ver Detalles
        </button>
      </div>
    </article>
  )
}

AtaudCard.propTypes = {
  ataud: PropTypes.object,
  onView: PropTypes.func,
}
