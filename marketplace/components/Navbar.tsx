'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'
import SignOutButton from './SignOutButton'

export default function Navbar() {
  const { data: session } = useSession()

  return (
    <nav className="navbar">
      <div className="container">
        <Link href="/">Marketplace</Link>
        <div className="links">
          <Link href="/products">Products</Link>
          <Link href="/cart">Cart</Link>
          {session?.user ? (
            <>
              <Link href="/dashboard">Dashboard</Link>
              <SignOutButton />
            </>
          ) : (
            <>
              <Link href="/login">Login</Link>
              <Link href="/register">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
