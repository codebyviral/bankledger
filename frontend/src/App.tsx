import { DashboardLayout } from '@/components/component.index'
import { Home, Signup, Login, Dashboard, Passbook, FundTransfer } from "@/page/page.index"
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
          <Route path='/account/dashboard' element={<Dashboard />} />
          <Route path='/account/passbook' element={<Passbook />} />
          <Route path='/account/fund-transfer' element={<FundTransfer />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App
