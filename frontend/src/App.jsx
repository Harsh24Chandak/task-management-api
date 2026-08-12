import React, { useState, useEffect } from 'react'
import Login from './components/Login'
import Dashboard from './components/Dashboard'

const API_URL = 'http://127.0.0.1:8000'

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [user, setUser] = useState(null)

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token)
    } else {
      localStorage.removeItem('token')
    }
  }, [token])

  const handleLogin = (newToken, userData) => {
    setToken(newToken)
    setUser(userData)
  }

  const handleLogout = () => {
    setToken(null)
    setUser(null)
  }

  if (!token) {
    return <Login onLogin={handleLogin} apiUrl={API_URL} />
  }

  return <Dashboard token={token} user={user} onLogout={handleLogout} apiUrl={API_URL} />
}

export default App
