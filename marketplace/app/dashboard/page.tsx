import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { authOptions } from '../../lib/nextAuth'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/login')
  }

  return (
    <main className="page-shell">
      <section className="dashboard-card">
        <h1>Welcome back, {session.user.name || 'seller'}</h1>
        <p>Your role: {session.user.role}</p>
        <div className="dashboard-actions">
          <Link href="/">Browse products</Link>
          <Link href="/login">Sign out</Link>
        </div>
      </section>
    </main>
  )
}
