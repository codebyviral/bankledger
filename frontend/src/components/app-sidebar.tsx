import * as React from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { ArrowLeftRight, LayoutDashboard, LogOutIcon, ReceiptText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { logoutUser } from "@/service/auth-service"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { useLocation } from "react-router-dom"
import BankLedgerLogo from "../../public/apple-touch-icon.png"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const items = [
    {
      name: 'Dashboard',
      icon: <LayoutDashboard />,
      navigate: '/account/dashboard',
      active: 'dashboard'
    },
    {
      name: 'Passbook',
      icon: <ReceiptText />,
      navigate: '/account/passbook',
      active: 'passbook'
    },
    {
      name: 'Transfer',
      icon: <ArrowLeftRight />,
      navigate: '/account/fund-transfer',
      active: 'fund-transfer'
    }
  ]

  const navigate = useNavigate();
  let location = useLocation().pathname;
  location = location.slice(9, location.length)

  /** 
   * Logout
   */
  async function handleLogout() {
    const response = await logoutUser()
    if (response.status == 200) toast('Logged out')
    localStorage.removeItem('accessToken')
    navigate('/auth/signin')
  }

  return (
    <Sidebar {...props}>
      <SidebarHeader>
      </SidebarHeader>
      <SidebarContent>
        <div className="p-5">
          <div>
            <img src={BankLedgerLogo} className="h-15 w-15 mb-5" alt="bank-ledger-logo" />
          </div>
          <h1 className="text-2xl text-[#D97757]">Bank Ledger</h1>
          <div className="uppercase mt-2">savings account</div>
          <div className="mt-20 flex flex-col gap-10 text-xl">
            {
              items.map((item, index) => {
                return (
                  <div onClick={() => navigate(item.navigate)} className={`flex gap-2 items-center cursor-pointer transition-all duration-300 ${item.active == location ? 'bg-[#d97757] p-2 text-white rounded' : ''}`} key={index}>
                    <div>{item.icon}</div>
                    <h2>{item.name}</h2>
                  </div>
                )
              })
            }
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
