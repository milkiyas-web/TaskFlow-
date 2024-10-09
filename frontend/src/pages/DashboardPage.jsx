import Sidebar from '@/components/Sidebar'
import TasksList from '@/components/TasksList'
import { Badge } from '@/components/ui/badge'
import { MenuIcon } from 'lucide-react'
import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Moon, Sun } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTheme } from "@/components/ThemeProvider"
import { UserButton } from '@clerk/clerk-react'
import { useOrganization } from '@clerk/clerk-react';

const DashboardPage = () => {
    const { setTheme } = useTheme()
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { organization, isLoaded } = useOrganization();

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    if (!isLoaded) {
        return <div className='flex items-center justify-center h-screen w-full'>
            <div className='loader'></div>
        </div>;
    }

    return (
        <div className=' relative min-h-screen w-full lg:grid lg:grid-cols-[280px_1fr]'>
            <div
                className={`fixed inset-y-0 h-full  left-0 z-50 w-64 transform transition-transform duration-200 ease-in-out lg:relative lg:translate-x-0  bg-muted dark:bg-black p-4 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <Sidebar />
            </div>
            {/* Overlay for small screens */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={toggleSidebar}
                ></div>
            )}
            <div className='flex flex-col'>
                <header className='flex h-14 lg:h-[60px] items-center gap-4 border-b bg-muted/40 dark:bg-black px-6'>
                    <div className="lg:hidden">
                        {/* Hamburger Menu for small screens */}
                        <button onClick={toggleSidebar} className="text-primary">
                            <MenuIcon className="h-6 w-6" />
                        </button>
                    </div>
                    <div className='flex-1'>
                        <div className='flex items-center gap-2'>
                            <h1 className='text-lg font-semibold'>Milkiyas's Workspace</h1>
                            <Badge className="bg-muted text-muted-foreground">12 Projects</Badge>
                        </div>
                    </div>
                    <UserButton afterSignOutUrl="/" />

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon">
                                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                                <span className="sr-only">Toggle theme</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setTheme("light")}>
                                Light
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setTheme("dark")}>
                                Dark
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setTheme("system")}>
                                System
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </header>
                <Outlet />
            </div>

        </div>
    )
}

export default DashboardPage