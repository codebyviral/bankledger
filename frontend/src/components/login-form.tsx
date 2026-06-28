import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import { loginUser } from "@/service/auth-service"
import { toast } from "sonner"
import { Loader } from "lucide-react"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

  const navigate = useNavigate()
  const [user, setUser] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState<boolean>(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    setUser({
      ...user,
      [e.target.name]: e.target.value
    })
  }



  /**
   * Login user
  */
  async function handleSubmit(e: React.ChangeEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true)
    try {
      const response = await loginUser(user.email, user.password);
      if (response.status == 200) {
        toast('Sign in successful')
        localStorage.setItem('accessToken', response.data.token)
        navigate("/account/dashboard")
      }
    } catch (error: any) {
      toast(error.response.data.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Sign In to your account</CardTitle>
          <CardDescription>
            Enter your email below to login your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  name='email'
                  autoFocus
                  value={user.email}
                  onChange={(e) => handleChange(e)}
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input onChange={(e) => handleChange(e)} value={user.password} name="password" id="password" type="password" required />
              </Field>
              <Field>
                <Button type="submit">{loading ? <div className="animate-spin"><Loader /></div> : 'Sign In'}</Button>
                <FieldDescription className="text-center">
                  Don&apos;t have an account? <Link to='/auth/signup'>Sign up</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
