'use client'

import { useState } from 'react'

interface User {
  id: string
  name: string
  email: string
  role: 'user' | 'vendor' | 'admin'
}

interface AdminUserManagerProps {
  initialUsers: User[]
}

export default function AdminUserManager({ initialUsers }: AdminUserManagerProps) {
  const [users, setUsers] = useState<User[]>(initialUsers)
  const [message, setMessage] = useState('')

  const updateUserRole = async (userId: string, newRole: string) => {
    setMessage('')

    const response = await fetch('/api/users', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, role: newRole }),
    })

    const data = await response.json()
    if (!response.ok) {
      setMessage(data.error || 'Unable to update role.')
      return
    }

    setUsers((current) =>
      current.map((user) => (user.id === userId ? { ...user, role: data.user.role } : user))
    )
    setMessage('User role updated successfully.')
  }

  return (
    <div className="admin-user-manager">
      <h2>Manage users</h2>
      <div className="user-table">
        <div className="user-row header">
          <span>Name</span>
          <span>Email</span>
          <span>Role</span>
          <span>Action</span>
        </div>
        {users.map((user) => (
          <div key={user.id} className="user-row">
            <span>{user.name}</span>
            <span>{user.email}</span>
            <span>{user.role}</span>
            <span>
              <select
                value={user.role}
                onChange={(event) => updateUserRole(user.id, event.target.value)}
              >
                <option value="user">user</option>
                <option value="vendor">vendor</option>
                <option value="admin">admin</option>
              </select>
            </span>
          </div>
        ))}
      </div>
      {message && <p className="success-message">{message}</p>}
    </div>
  )
}
