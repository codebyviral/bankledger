import { LoginForm } from '@/components/login-form'

const Login = () => {
  return (
    <div className='h-screen flex justify-center items-center'>
      <div className='lg:w-1/4 w-full'>
        <LoginForm />
      </div>
    </div>
  )
}

export default Login
