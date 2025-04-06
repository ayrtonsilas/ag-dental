import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-blue-500 to-indigo-600 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
        </div>
        
        <div className="mx-auto max-w-3xl py-32 sm:py-48 lg:py-52">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-700">
              Gestão de Consultórios
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Simplifique a gestão do seu consultório médico ou odontológico com nossa plataforma completa. Agende consultas, gerencie pacientes e controle suas finanças em um só lugar.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/register"
                className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                Começar agora
              </Link>
              <Link 
                href="/login" 
                className="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors flex items-center"
              >
                Fazer login 
                <svg className="ml-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
        
        <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
          <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-indigo-500 to-blue-600 opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"></div>
        </div>

        {/* Feature section */}
        <div className="mx-auto max-w-7xl py-24">
          <div className="grid grid-cols-1 gap-y-12 gap-x-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white rounded-2xl shadow-xl p-8 transform transition-transform hover:scale-105">
              <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center mb-6">
                <svg className="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Agendamento Inteligente</h3>
              <p className="text-gray-600">Gerencie consultas com facilidade, evite conflitos de horários e envie lembretes automáticos.</p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 transform transition-transform hover:scale-105">
              <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center mb-6">
                <svg className="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Gestão de Pacientes</h3>
              <p className="text-gray-600">Mantenha histórico completo, documentos e informações importantes dos seus pacientes organizados.</p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 transform transition-transform hover:scale-105">
              <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center mb-6">
                <svg className="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Controle Financeiro</h3>
              <p className="text-gray-600">Acompanhe pagamentos, gere relatórios e mantenha a saúde financeira do seu consultório.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
