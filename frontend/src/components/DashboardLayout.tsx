import { Outlet } from "react-router-dom"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import Header from "@/components/header"

const DashboardLayout = () => {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <Header />
                <Outlet />
            </SidebarInset>
        </SidebarProvider>
    )
}

export default DashboardLayout
