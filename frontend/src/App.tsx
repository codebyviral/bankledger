import { DashboardLayout } from '@/components/component.index'
import Dashboard from '@/page/Dashboard'
import Home from '@/page/Home'
import Login from '@/page/Login'
import Signup from '@/page/Signup'
import { Routes, Route } from 'react-router-dom'

const App = () => {
  return (
    <div>
      <Routes>
        {/* Public Routes */}
        <Route path='/' element={<Home />} />
        <Route path='/auth/signup' element={<Signup />} />
        <Route path='/auth/signin' element={<Login />} />
        <Route element={<DashboardLayout />}>
          <Route path='/dashboard' element={<Dashboard />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App
