import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <section className="bg-[#F5F2EF] py-24 border-b border-[#E3D7CC]">
      <div className="max-w-6xl mx-auto px-6 text-center">

        {/* Título principal */}
        <h1 className="text-4xl sm:text-6xl font-semibold leading-tight text-[#5B3A20]">
          Dignidad y Gracia en la
          <br />
          Despedida Final
        </h1>

        {/* Subtítulo */}
        <p className="max-w-xl mx-auto mt-6 text-[#8A7A68] text-lg">
          En tiempos de pérdida, encuentra consuelo en un acompañamiento humano y respetuoso.
        </p>

        {/* Botón */}
        <div className="mt-10">
          <Link
            to="/ataudes"
            className="inline-block px-8 py-3 text-sm font-medium rounded-full 
                       bg-[#B28153] text-[#F5F2EF] shadow-md 
                       hover:bg-[#8C5F32] transition-colors"
          >
            Explora Nuestra Colección
          </Link>
        </div>

      </div>
    </section>
  )
}
