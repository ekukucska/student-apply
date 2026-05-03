import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center px-4">
      <div className="max-w-3xl w-full text-center">
        <h1 className="text-6xl font-extrabold text-gray-900 mb-4 tracking-tight">
          Student<span className="text-indigo-600">Apply</span>
        </h1>
        <p className="text-xl text-gray-600 mb-3 max-w-xl mx-auto leading-relaxed">
          Explore university programs and submit your application — all in one place.
        </p>
        <p className="text-sm text-gray-400 mb-10">
          Powered by <span className="font-medium text-blue-500">PostgreSQL</span> &amp;{' '}
          <span className="font-medium text-green-500">MongoDB</span>
        </p>
        <Link
          href="/programs"
          className="inline-flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors text-lg shadow-sm"
        >
          Browse Programs
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>
    </main>
  )
}
