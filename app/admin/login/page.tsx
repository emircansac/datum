'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const response = await fetch('/admin/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })

    if (response.ok) {
      router.push('/admin')
      router.refresh()
    } else {
      setError('Yanlış şifre')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-lg border border-gray-200">
        <h1 className="text-2xl font-semibold mb-6">Admin Girişi</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              Şifre
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
              required
            />
          </div>
          {error && (
            <p className="text-sm text-red-600 mb-4">{error}</p>
          )}
          <button
            type="submit"
            className="w-full px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Giriş Yap
          </button>
        </form>
      </div>
    </div>
  )
}
