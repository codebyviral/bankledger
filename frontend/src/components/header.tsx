import { SidebarTrigger } from "@/components/ui/sidebar";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

const Header = () => {
    const { theme, setTheme } = useTheme();
    return (
        <header className="flex h-16 items-center border-b px-4">
            <SidebarTrigger />
            <div onClick={() => { setTheme(theme === 'dark' ? 'light' : 'dark') }} className="absolute cursor-pointer transition-all ease-in-out duration-300 right-5">
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </div>
        </header>
    )
}

export default Header
