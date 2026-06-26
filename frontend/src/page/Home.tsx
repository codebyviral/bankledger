import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { useTheme } from 'next-themes';
import { Moon } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  return (
    <div>
      <div className='h-screen flex justify-center items-center flex-col'>
        <h1 className='text-3xl'>Welcome to Bank Ledger</h1>
        <div className='mt-3 flex flex-row gap-3'>
          <Button onClick={() => navigate('/auth/signin')} className='text-lg'>Login</Button>
          <Button onClick={() => navigate('/auth/signup')} className='text-lg'>Signup</Button>
          <Button className='h-auto' variant='ghost' onClick={() => {
            setTheme(theme === 'dark' ? 'light' : 'dark')
          }}><Moon /></Button>
        </div>
      </div>
    </div>
  )
}

export default Home
