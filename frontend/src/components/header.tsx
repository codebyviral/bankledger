import { SidebarTrigger } from "@/components/ui/sidebar";
import { BellIcon } from "lucide-react";

const Header = () => {
    return (
        <header className="flex h-16 items-center border-b px-4">
            <SidebarTrigger />
            <div className="absolute right-5">
                <BellIcon size={18} />
            </div>
        </header>
    )
}

export default Header
