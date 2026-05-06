import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      role: 'user' | 'vendor' | 'admin'
    }
  }

  interface User {
    id: string
    role: 'user' | 'vendor' | 'admin'
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: 'user' | 'vendor' | 'admin'
  }
}
