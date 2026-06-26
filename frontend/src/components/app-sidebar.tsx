import * as React from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { ArrowLeftRight, LayoutDashboard, LogOutIcon, Moon, ReceiptText, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { logoutUser } from "@/service/auth-service"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { useTheme } from "next-themes"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const items = [
    {
      name: 'Dashboard',
      icon: <LayoutDashboard />,
    },
    {
      name: 'Passbook',
      icon: <ReceiptText />,
    },
    {
      name: 'Transfer',
      icon: <ArrowLeftRight />
    }
  ]

  const navigate = useNavigate();

  /** 
   * Logout
   */
  async function handleLogout() {
    const response = await logoutUser()
    if (response.status == 200) toast('Logged out')
    localStorage.removeItem('accessToken')
    navigate('/auth/signin')
  }

  const { theme, setTheme } = useTheme();

  return (
    <Sidebar {...props}>
      <SidebarHeader>
      </SidebarHeader>
      <SidebarContent>
        <div className="p-5">
          <h1 className="text-2xl text-[#D97757]">Bank Ledger</h1>
          <div className="uppercase mt-2">savings account</div>
          <div className="mt-20 flex flex-col gap-10 text-xl">
            {
              items.map((item, index) => {
                return (
                  <div className="flex gap-2 items-center cursor-pointer transition-all hover:text-2xl" key={index}>
                    <div>{item.icon}</div>
                    <h2>{item.name}</h2>
                  </div>
                )
              })
            }
            <div onClick={() => {
              setTheme(theme === 'dark' ? 'light' : 'dark')
            }} className="flex gap-2 items-center cursor-pointer transition-all hover:text-2xl">
              <div> {theme === 'dark' ? <Sun /> : <Moon />} </div>
              <h2 className="capitalize">{theme === 'dark' ? 'Light' : 'dark'}</h2>
            </div>
          </div>
          <div className="absolute bottom-5 flex gap-1 cursor-pointer">
            <Button onClick={handleLogout} className='m-auto p-auto justify-center flex items-center'>
              Logout
              <LogOutIcon className="mr-3" />
            </Button>
          </div>
        </div>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
