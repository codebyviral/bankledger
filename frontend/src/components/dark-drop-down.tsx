import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Moon } from "lucide-react"

export function DarkDropdown() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger render={<Button className='rounded-full' variant="outline"><Moon size={16} /></Button>} />
            <DropdownMenuContent className="w-40" align="start">
                <DropdownMenuGroup>
                    <DropdownMenuLabel>Theme </DropdownMenuLabel>
                    <DropdownMenuItem>
                        Dark
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        Light
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
