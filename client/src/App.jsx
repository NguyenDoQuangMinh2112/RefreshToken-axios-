import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import Login from '~/pages/Login'
import Dashboard from '~/pages/Dashboard'

const ProtectedRoute = () => {
  const user = localStorage.getItem('userInfo')
  if (!user) {
    return <Navigate to="login" replace="true" />
  }
  return <Outlet />
}

const UnAuthorizedRoute = () => {
  const user = localStorage.getItem('userInfo')
  if (user) {
    return <Navigate to="dashboard" replace="true" />
  }
  return <Outlet />
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace={true} />} />

      <Route element={<UnAuthorizedRoute />}>
        <Route path="/login" element={<Login />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>
    </Routes>
  )
}

export default App
