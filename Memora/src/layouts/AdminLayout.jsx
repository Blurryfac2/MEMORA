import { Outlet, NavLink } from 'react-router-dom'


export default function AdminLayout() {
return (
<div className="min-h-screen grid grid-cols-1 md:grid-cols-[240px_1fr]">
<aside className="border-r p-4 space-y-2">
<div className="font-semibold">Panel Admin</div>
<nav className="flex flex-col gap-1">
<NavLink to="/admin" end>Dashboard</NavLink>
<NavLink to="/admin/pedidos">Pedidos</NavLink>
<NavLink to="/admin/ataudes">Ataúdes</NavLink>
</nav>
</aside>
<section className="p-4"> <Outlet /> </section>
</div>
)
}