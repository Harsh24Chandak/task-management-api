import React, { useState, useEffect } from 'react'

function Dashboard({ token, user, onLogout, apiUrl }) {
  const [teams, setTeams] = useState([])
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showCreateTask, setShowCreateTask] = useState(false)
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    team_id: '',
    priority: 'medium'
  })

  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)

      // Fetch teams
      const teamsRes = await fetch(`${apiUrl}/teams/`, { headers })
      if (teamsRes.ok) setTeams(await teamsRes.json())

      // Fetch tasks
      const tasksRes = await fetch(`${apiUrl}/tasks/`, { headers })
      if (tasksRes.ok) setTasks(await tasksRes.json())

    } catch (err) {
      setError('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTask = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch(`${apiUrl}/tasks/`, {
        method: 'POST',
        headers,
        body: JSON.stringify(newTask)
      })
      if (res.ok) {
        setNewTask({ title: '', description: '', team_id: '', priority: 'medium' })
        setShowCreateTask(false)
        fetchData()
      } else {
        setError('Failed to create task')
      }
    } catch (err) {
      setError('Network error')
    }
  }

  const getPriorityColor = (priority) => {
    const colors = { low: '#22c55e', medium: '#f59e0b', high: '#ef4444' }
    return colors[priority] || '#666'
  }

  const getStatusColor = (status) => {
    const colors = { todo: '#6b7280', in_progress: '#3b82f6', done: '#22c55e' }
    return colors[status] || '#666'
  }

  if (loading) return <div style={styles.loading}>Loading...</div>

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.headerTitle}>Task Manager</h1>
        <div style={styles.headerRight}>
          <span style={styles.welcome}>Welcome, {user?.username || 'User'}</span>
          <button onClick={onLogout} style={styles.logoutBtn}>Logout</button>
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.main}>
        {/* Sidebar */}
        <div style={styles.sidebar}>
          <h3 style={styles.sidebarTitle}>My Teams</h3>
          {teams.length === 0 ? (
            <p style={styles.empty}>No teams yet</p>
          ) : (
            teams.map(team => (
              <div key={team.id} style={styles.teamCard}>
                <div style={styles.teamName}>{team.name}</div>
                <div style={styles.teamDesc}>{team.description}</div>
              </div>
            ))
          )}
        </div>

        {/* Tasks Area */}
        <div style={styles.content}>
          <div style={styles.contentHeader}>
            <h2 style={styles.contentTitle}>My Tasks</h2>
            <button onClick={() => setShowCreateTask(!showCreateTask)} style={styles.createBtn}>
              {showCreateTask ? 'Cancel' : '+ New Task'}
            </button>
          </div>

          {error && <div style={styles.error}>{error}</div>}

          {/* Create Task Form */}
          {showCreateTask && (
            <form onSubmit={handleCreateTask} style={styles.form}>
              <input
                type="text"
                placeholder="Task title"
                value={newTask.title}
                onChange={e => setNewTask({...newTask, title: e.target.value})}
                style={styles.formInput}
                required
              />
              <textarea
                placeholder="Description"
                value={newTask.description}
                onChange={e => setNewTask({...newTask, description: e.target.value})}
                style={styles.formTextarea}
              />
              <select
                value={newTask.team_id}
                onChange={e => setNewTask({...newTask, team_id: parseInt(e.target.value)})}
                style={styles.formInput}
                required
              >
                <option value="">Select Team</option>
                {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
              <select
                value={newTask.priority}
                onChange={e => setNewTask({...newTask, priority: e.target.value})}
                style={styles.formInput}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              <button type="submit" style={styles.submitBtn}>Create Task</button>
            </form>
          )}

          {/* Tasks List */}
          {tasks.length === 0 ? (
            <div style={styles.emptyState}>
              <p>No tasks yet. Create your first task!</p>
            </div>
          ) : (
            <div style={styles.taskList}>
              {tasks.map(task => (
                <div key={task.id} style={styles.taskCard}>
                  <div style={styles.taskHeader}>
                    <h4 style={styles.taskTitle}>{task.title}</h4>
                    <span style={{...styles.badge, background: getPriorityColor(task.priority)}}>
                      {task.priority}
                    </span>
                  </div>
                  <p style={styles.taskDesc}>{task.description}</p>
                  <div style={styles.taskFooter}>
                    <span style={{...styles.statusBadge, background: getStatusColor(task.status)}}>
                      {task.status}
                    </span>
                    <span style={styles.taskDate}>
                      {new Date(task.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: { minHeight: '100vh', background: '#f5f7fa' },
  loading: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '18px' },

  header: { background: 'white', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
  headerTitle: { fontSize: '24px', fontWeight: 'bold', color: '#333' },
  headerRight: { display: 'flex', alignItems: 'center', gap: '16px' },
  welcome: { color: '#666' },
  logoutBtn: { padding: '8px 16px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' },

  main: { display: 'flex', padding: '24px 32px', gap: '24px', maxWidth: '1400px', margin: '0 auto' },

  sidebar: { width: '280px', background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', height: 'fit-content' },
  sidebarTitle: { fontSize: '18px', fontWeight: 'bold', marginBottom: '16px', color: '#333' },
  teamCard: { padding: '12px', background: '#f8fafc', borderRadius: '8px', marginBottom: '8px' },
  teamName: { fontWeight: '600', color: '#333' },
  teamDesc: { fontSize: '13px', color: '#666', marginTop: '4px' },

  content: { flex: 1, background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  contentHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  contentTitle: { fontSize: '20px', fontWeight: 'bold', color: '#333' },
  createBtn: { padding: '10px 20px', background: '#667eea', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },

  form: { background: '#f8fafc', padding: '20px', borderRadius: '8px', marginBottom: '20px' },
  formInput: { width: '100%', padding: '10px', marginBottom: '12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px' },
  formTextarea: { width: '100%', padding: '10px', marginBottom: '12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', minHeight: '80px', resize: 'vertical' },
  submitBtn: { padding: '10px 24px', background: '#22c55e', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' },

  taskList: { display: 'flex', flexDirection: 'column', gap: '12px' },
  taskCard: { padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px', background: '#fafafa' },
  taskHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' },
  taskTitle: { fontSize: '16px', fontWeight: '600', color: '#333' },
  badge: { padding: '4px 10px', borderRadius: '12px', color: 'white', fontSize: '12px', fontWeight: 'bold' },
  taskDesc: { color: '#666', fontSize: '14px', marginBottom: '12px' },
  taskFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  statusBadge: { padding: '4px 10px', borderRadius: '12px', color: 'white', fontSize: '12px' },
  taskDate: { fontSize: '12px', color: '#999' },

  empty: { color: '#999', fontSize: '14px', textAlign: 'center', padding: '20px' },
  emptyState: { textAlign: 'center', padding: '60px 20px', color: '#999' },
  error: { background: '#fee2e2', color: '#dc2626', padding: '10px', borderRadius: '6px', marginBottom: '16px' }
}

export default Dashboard
