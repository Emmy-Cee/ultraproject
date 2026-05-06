'use client'

import { FormEvent, useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const router = useRouter()

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setMessage('')

    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    })

    const data = await response.json()
    if (!response.ok) {
      setError(data.error || 'Unable to register. Please try again.')
      return
    }

    setMessage('Registration successful. Redirecting to login...')
    await signIn('credentials', {
      redirect: false,
      email,
      password,
    })
    router.push('/dashboard')
  }

  return (
    <main className="page-shell">
      <section className="auth-card">
        <h1>Sign up</h1>
        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            Full name
            <input value={name} onChange={(e) => setName(e.target.value)} type="text" required />
          </label>
          <label>
            Email
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
          </label>
          <label>
            Password
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required minLength={6} />
          </label>
          {error && <p className="error-message">{error}</p>}
          {message && <p className="success-message">{message}</p>}
          <button type="submit">Create account</button>
        </form>
        <p>
          Already registered? <Link href="/login">Login</Link>
        </p>
      </section>
    </main>
  )
}
