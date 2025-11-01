import { useEffect, useState } from 'react'
import {
  adminListAtaudes, adminCreateAtaud,
  adminUpdateAtaud, adminDeleteAtaud
} from '../features/admin/admin.ataudes.service'

export default function AdminAtaudes() {
  const [rows, setRows] = useState([])
  const [err, setErr] = useState('')
  const [form, setForm] = useState({ nombre:'', slug:'', precio:0 })
  const [editing, setEditing] = useState(null)

  const load = () => adminListAtaudes().then(setRows).catch(e=>setErr(e.message))
  useEffect(()=>{ load() },[])

  async function save(e){
    e.preventDefault()
    try{
      if(editing){
        await adminUpdateAtaud(editing.id, form)
        setEditing(null)
      }else{
        await adminCreateAtaud(form)
      }
      setForm({ nombre:'', slug:'', precio:0 })
      await load()
    }catch(e){ alert(e.message) }
  }

  async function remove(id){
    if(!confirm('¿Eliminar ataúd?')) return
    try{ await adminDeleteAtaud(id); await load() }catch(e){ alert(e.message) }
  }

  function editRow(r){
    setEditing(r)
    setForm({
      nombre: r.nombre || '',
      slug: r.slug || '',
      precio: r.precio || 0,
      descripcion: r.descripcion || '',
      material: r.material || '',
      interior: r.interior || '',
      dimensiones: r.dimensiones || '',
      imagen_url: r.imagen_url || '',
      stock: r.stock ?? null
    })
  }

  if (err) return <div className="p-6 text-red-600">{err}</div>

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Ataúdes</h1>

      <form onSubmit={save} className="grid sm:grid-cols-2 gap-3 border rounded p-4">
        <input className="border rounded px-3 py-2" placeholder="Nombre"
               value={form.nombre} onChange={e=>setForm(f=>({...f,nombre:e.target.value}))}/>
        <input className="border rounded px-3 py-2" placeholder="Slug"
               value={form.slug} onChange={e=>setForm(f=>({...f,slug:e.target.value}))}/>
        <input className="border rounded px-3 py-2" placeholder="Precio" type="number" step="0.01"
               value={form.precio} onChange={e=>setForm(f=>({...f,precio:e.target.value}))}/>
        <input className="border rounded px-3 py-2" placeholder="Stock" type="number"
               value={form.stock ?? ''} onChange={e=>setForm(f=>({...f,stock:e.target.value}))}/>
        <input className="border rounded px-3 py-2 sm:col-span-2" placeholder="Imagen URL"
               value={form.imagen_url ?? ''} onChange={e=>setForm(f=>({...f,imagen_url:e.target.value}))}/>
        <textarea className="border rounded px-3 py-2 sm:col-span-2" placeholder="Descripción"
               value={form.descripcion ?? ''} onChange={e=>setForm(f=>({...f,descripcion:e.target.value}))}/>
        <div className="sm:col-span-2 flex gap-2">
          <button className="bg-orange-600 text-white px-4 py-2 rounded">
            {editing ? 'Actualizar' : 'Crear'}
          </button>
          {editing && (
            <button type="button" className="border px-4 py-2 rounded"
              onClick={()=>{ setEditing(null); setForm({nombre:'',slug:'',precio:0}) }}>
              Cancelar
            </button>
          )}
        </div>
      </form>

      <div className="overflow-x-auto border rounded">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <Th>Nombre</Th><Th>Slug</Th><Th>Precio</Th><Th>Stock</Th><Th></Th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r=>(
              <tr key={r.id} className="border-t">
                <Td>{r.nombre}</Td>
                <Td>{r.slug}</Td>
                <Td>${Number(r.precio||0).toFixed(2)}</Td>
                <Td>{r.stock ?? '—'}</Td>
                <Td className="flex gap-2 py-2">
                  <button className="underline" onClick={()=>editRow(r)}>Editar</button>
                  <button className="text-red-600 underline" onClick={()=>remove(r.id)}>Eliminar</button>
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
