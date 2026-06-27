import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import SuperAdmin from './pages/SuperAdmin'
import Pharmacy from './pages/Pharmacy'
import Electronics from './pages/Electronics'
import Hardware from './pages/Hardware'
import Restaurant from './pages/Restaurant'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/super-admin" element={<ProtectedRoute role="super_admin"><SuperAdmin /></ProtectedRoute>} />
        <Route path="/pharmacy" element={<ProtectedRoute role="admin_cashier"><Pharmacy /></ProtectedRoute>} />
        <Route path="/electronics" element={<ProtectedRoute role="admin_cashier"><Electronics /></ProtectedRoute>} />
        <Route path="/hardware" element={<ProtectedRoute role="admin_cashier"><Hardware /></ProtectedRoute>} />
        <Route path="/restaurant" element={<ProtectedRoute role="admin_cashier"><Restaurant /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App