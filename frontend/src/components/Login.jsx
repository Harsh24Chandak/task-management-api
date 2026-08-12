import React, { useState } from 'react'

function Login({ onLogin, apiUrl }) {
  const [isRegister, setIsRegister] = useState(false)
  const [form, setForm] = useState({
    username: '',
    password: '',
    email: '',
    full_name: '',
    role: 'member'
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isRegister) {
        const res = await fetch(`${apiUrl}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form)
        })
        if (!res.ok) throw new Error('Registration failed')
        setIsRegister(false)
        setError('Registration successful! Please login.')
      } else {
        const params = new URLSearchParams()
        params.append('username', form.username)
        params.append('password', form.password)

        const res = await fetch(`${apiUrl}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: params
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.detail || 'Login failed')

        onLogin(data.access_token, { username: form.username })
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Task Manager</h1>
        <p style={styles.subtitle}>
          {isRegister ? 'Create your account' : 'Sign in to your account'}
        </p>

        {error && (
          <div style={error.includes('successful') ? styles.success : styles.error}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          {isRegister && (
            <>
              <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} style={styles.input} required />
              <input type="text" name="full_name" placeholder="Full Name" value={form.full_name} onChange={handleChange} style={styles.input} />
              <select name="role" value={form.role} onChange={handleChange} style={styles.input}>
                <option value="member">Member</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
              </select>
            </>
          )}
          <input type="text" name="username" placeholder="Username" value={form.username} onChange={handleChange} style={styles.input} required />
          <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} style={styles.input} required />
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Loading...' : (isRegister ? 'Register' : 'Login')}
          </button>
        </form>

        <p style={styles.switch}>
          {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button onClick={() => { setIsRegister(!isRegister); setError('') }} style={styles.link}>
            {isRegister ? 'Login' : 'Register'}
          </button>
        </p>
      </div>
    </div>
  )
}

const styles = {
  container: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  card: { background: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', width: '100%', maxWidth: '400px' },
  title: { fontSize: '28px', fontWeight: 'bold', color: '#333', marginBottom: '8px', textAlign: 'center' },
  subtitle: { color: '#666', textAlign: 'center', marginBottom: '24px' },
  form: { display: 'flex', flexDirection: 'column', gap: '12px' },
  input: { padding: '12px 16px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', outline: 'none' },
  button: { padding: '12px', background: '#667eea', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginTop: '8px' },
  error: { background: '#fee2e2', color: '#dc2626', padding: '10px', borderRadius: '6px', fontSize: '14px', marginBottom: '16px' },
  success: { background: '#d1fae5', color: '#059669', padding: '10px', borderRadius: '6px', fontSize: '14px', marginBottom: '16px' },
  switch: { textAlign: 'center', marginTop: '20px', color: '#666', fontSize: '14px' },
  link: { background: 'none', border: 'none', color: '#667eea', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }
}

export default Login
