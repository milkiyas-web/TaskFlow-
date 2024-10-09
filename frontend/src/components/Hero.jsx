import React from 'react'
import { Star } from 'lucide-react'
import { Button } from "@/components/ui/button"
import Ripple from "@/components/magicui/ripple";
import BlurIn from './magicui/blur-in';
import ShinyButton from './magicui/shiny-button';
import ShimmerButton from './magicui/shimmer-button';
import FloatingIcons from './FloatingIcons';
import { Link } from 'react-router-dom';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Moon, Sun } from "lucide-react"
const Hero = () => {
    return (
        <div className="min-h-screen bg-black dark:text-white font-sans">
            {/* Hero Section */}
            <div className="relative overflow-hidden">
                {/* Ripple effect for the entire hero section */}
                <Ripple />

                {/* Floating Icons */}
                <FloatingIcons />

                {/* Navigation */}
                <nav className="relative z-10 px-6 py-4 flex justify-between items-center">
                    <div className="text-2xl font-bold">TaskFlow</div>
                    <div className="space-x-4">
                        <Link to="/sign-in">
                            <Button variant="ghost" className="text-white rounded-3xl">Log in</Button>
                        </Link>
                        <Link to="/sign-up">
                            <Button variant="outline" className="text-white rounded-3xl border-gray-700 bg-gray-700 hover:bg-white hover:text-black">Sign up</Button>
                        </Link>
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
                    </div>
                </nav>

                <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 py-20">
                    {/* Feature tag */}
                    <div className="mb-12 z-40">
                        <ShimmerButton className="inline-flex dark:text-white bg-slate-100 items-center px-4 py-2 rounded-full text-sm">
                            <Star className="w-4 h-4 mr-2 text-yellow-500" />
                            Introducing TaskFlow
                        </ShimmerButton>
                    </div>

                    {/* Main heading */}
                    {/* <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 leading-tight max-w-4xl">
                        TaskFlow is the new way to manage your tasks.
                    </h1> */}
                    <BlurIn
                        word="TaskFlow is the new way to manage your tasks."
                        className="text-5xl sm:text-2xl md:text-6xl font-bold mb-6 leading-tight max-w-4xl"
                    />

                    {/* Subheading */}
                    <p className="text-xl sm:text-md mb-8 max-w-2xl text-gray-300">
                        Streamline your workflow, boost productivity, and achieve your goals
                        with our intuitive task management platform.
                    </p>


                    {/* CTA Button */}
                    <Link to="/dashboard">
                        <ShinyButton size="lg" className=" bg-blue-900/50 text-white rounded-3xl  hover:bg-blue-900/50 hover:text-black">
                            <span className='text-white'>Get Started for free</span>
                            <span className="ml-2 text-white">→</span>
                        </ShinyButton>
                    </Link>
                </div>
            </div>

            {/* Rest of the component... */}
        </div>
    )
}

export default Hero