import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth()

  if (loading) return (
    <div style={{ 
      height: '100vh', display: 'flex', 
      alignItems: 'center', justifyContent: 'center',
      fontFamily: 'system-ui', color: '#1E3A5F', fontSize: 14
    }}>
      Loading...
    </div>
  )

  if (!user) return <Navigate to="/" replace />

  if (role === 'super_admin' && user.role !== 'super_admin') return <Navigate to="/" replace />

  return children
}

export default ProtectedRoute