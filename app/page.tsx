import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-[calc(100vh-3rem)] bg-ibm-canvas flex items-center justify-center px-6">
      <div className="max-w-2xl w-full">

        {/* Hero */}
        <div className="mb-2">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-ibm-blue mb-6">
            University Admissions Platform
          </span>
        </div>

        <h1 className="text-5xl font-light text-ibm-text-primary leading-tight mb-4">
          Find your next<br />
          <span className="font-semibold text-ibm-blue">program.</span>
        </h1>

        <p className="text-ibm-text-secondary text-lg leading-relaxed mb-8 max-w-lg">
          Explore Bachelor, Master, and Certificate programs. Submit your application in minutes with dynamic, program-specific forms.
        </p>

        <Link
          href="/programs"
          className="inline-flex items-center gap-2 bg-ibm-blue hover:bg-ibm-blue-hover text-ibm-text-inverse text-sm font-semibold px-6 py-3 transition-colors"
        >
          Browse Programs
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>
    </main>
  )
}
