// src/features/orders/orders.service.js
import { supabase } from '../../lib/supabase'

// Lista de pedidos del usuario (propio front)
export async function getMyOrders() {
  const { data, error } = await supabase
    .from('pedidos')
    .select(`
      id,
      public_id,
      user_id,
      ataud_id,
      precio_unitario,
      cantidad,
      order_status,
      created_at,
      ataudes:ataud_id ( nombre, precio, slug )
    `)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function getOrderByPublicId(publicId) {
  const { data, error } = await supabase
    .from('pedidos')
    .select(`
      id,
      public_id,
      user_id,
      ataud_id,
      precio_unitario,
      cantidad,
      order_status,
      created_at,
      ataudes:ataud_id ( nombre, precio, slug )
    `)
    .eq('public_id', publicId)
    .single()
  if (error) throw error
  return data
}

// Solo admin (panel)
export async function setOrderStatus(id, order_status) {
  const { data, error } = await supabase
    .from('pedidos')
    .update({ order_status })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

/** Crea un pedido para el usuario logueado y devuelve { id, public_id } */
export async function createPedido({ ataud, user }) {
  const payload = {
    user_id: user.id,
    ataud_id: ataud.id,
    precio_unitario: ataud.precio,
    cantidad: 1,
    // si luego los llenas en un paso de checkout, déjalos null
    nombre: user.user_metadata?.full_name ?? null,
    email: user.email ?? null,
    telefono: null,
    direccion: null,
  }

  const { data, error } = await supabase
    .from('pedidos')
    .insert(payload)
    .select('id, public_id')
    .single()

  if (error) throw error
  return data
}