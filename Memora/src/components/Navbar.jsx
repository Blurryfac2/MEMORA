import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.jsx'


export default function Navbar(){
const { session } = useAuth() || {}
return (
<header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b">
<div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
<Link to="/" className="font-semibold">Ethereal Repose</Link>
<nav className="hidden sm:flex items-center gap-6 text-sm">
<NavLink to="/">Inicio</NavLink>
<NavLink to="/ataudes">Ataúdes</NavLink>
<NavLink to="/contacto">Contacto</NavLink>
</nav>
<div>
{!session ? (
<Link to="/login" className="text-sm">Iniciar Sesión</Link>
) : (
<Link to="/cuenta" title="Cuenta" aria-label="Cuenta" className="text-xl">👤</Link>
)}
</div>
</div>
</header>
)
}