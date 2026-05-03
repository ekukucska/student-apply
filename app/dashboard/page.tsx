import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

const STATUS_CFG = {
  DRAFT:        { label: 'Draft',        row: 'bg-ibm-overlay text-ibm-text-secondary' },
  SUBMITTED:    { label: 'Submitted',    row: 'bg-ibm-blue text-ibm-text-inverse' },
  UNDER_REVIEW: { label: 'Under Review', row: 'bg-ibm-warning text-ibm-text-primary' },
  ACCEPTED:     { label: 'Accepted',     row: 'bg-ibm-success text-ibm-text-inverse' },
  REJECTED:     { label: 'Rejected',     row: 'bg-ibm-error text-ibm-text-inverse' },
} as const

const TYPE_CFG = {
  BACHELOR:    'bg-tag-bachelor text-ibm-text-inverse',
  MASTER:      'bg-tag-master text-ibm-text-inverse',
  CERTIFICATE: 'bg-tag-cert text-ibm-text-inverse',
} as const

export default async function DashboardPage() {
  const applications = await prisma.applicationStatus.findMany({
    include: { program: true, user: true },
    orderBy: { updatedAt: 'desc' },
  })

  const counts = Object.fromEntries(
    Object.keys(STATUS_CFG).map(s => [s, applications.filter(a => a.status === s).length])
  )

  return (
    <main className="min-h-screen bg-ibm-canvas">

      {/* ── Page header ── */}
      <div className="bg-ibm-nav text-ibm-text-inverse px-6 py-10">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-semibold tracking-widest uppercase text-ibm-text-muted mb-2">Admin</p>
          <h1 className="text-3xl font-light">Applications Dashboard</h1>
          <p className="text-ibm-text-muted text-sm mt-1">
            {applications.length} application{applications.length !== 1 ? 's' : ''} total
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">

        {/* ── Status summary cards ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {(Object.entries(STATUS_CFG) as [keyof typeof STATUS_CFG, typeof STATUS_CFG[keyof typeof STATUS_CFG]][]).map(([status, cfg]) => (
            <div key={status} className="bg-ibm-card border border-ibm-border p-4">
              <p className="text-3xl font-light text-ibm-text-primary">{counts[status] ?? 0}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className={`inline-block w-2 h-2 ${cfg.row.split(' ')[0]}`} />
                <p className="text-xs text-ibm-text-muted">{cfg.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Applications table ── */}
        {applications.length === 0 ? (
          <div className="bg-ibm-card border border-ibm-border p-16 text-center">
            <p className="text-ibm-text-secondary font-medium">No applications yet.</p>
            <p className="text-ibm-text-muted text-sm mt-1">Applications will appear here once students submit them.</p>
          </div>
        ) : (
          <div className="bg-ibm-card border border-ibm-border overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-ibm-border bg-ibm-canvas">
                  {['Applicant', 'Program', 'Type', 'Status', 'Last Updated', 'Actions'].map((h, i) => (
                    <th
                      key={h}
                      className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider text-ibm-text-muted ${i === 5 ? 'text-right' : 'text-left'}`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {applications.map(app => {
                  const sCfg = STATUS_CFG[app.status as keyof typeof STATUS_CFG]
                  const tCfg = TYPE_CFG[app.program.type as keyof typeof TYPE_CFG]
                  return (
                    <tr key={app.id} className="border-b border-ibm-border hover:bg-ibm-blue-light transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-medium text-ibm-text-primary">{app.user.name}</p>
                        <p className="text-xs text-ibm-text-muted">{app.user.email}</p>
                      </td>
                      <td className="px-4 py-3 text-ibm-text-secondary max-w-[200px]">
                        <p className="truncate">{app.program.name}</p>
                        <p className="text-xs text-ibm-text-muted truncate">{app.program.university}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-semibold px-2 py-0.5 ${tCfg}`}>
                          {app.program.type}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-semibold px-2.5 py-1 ${sCfg.row}`}>
                          {sCfg.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-ibm-text-muted whitespace-nowrap">
                        {new Date(app.updatedAt).toLocaleDateString('en-GB', {
                          day: '2-digit', month: 'short', year: 'numeric',
                        })}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-12">
                          <Link
                            href={`/dashboard/${app.id}`}
                            className="text-xs font-semibold text-ibm-blue hover:text-ibm-blue-hover transition-colors whitespace-nowrap"
                          >
                            View →
                          </Link>
                          <a
                            href={`/api/applications/${app.id}/download`}
                            className="text-xs font-semibold text-ibm-blue hover:text-ibm-blue-hover transition-colors whitespace-nowrap"
                          >
                            Download ↓
                          </a>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  )
}
