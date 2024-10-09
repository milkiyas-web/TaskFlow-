"use client"
import React, { useState, useEffect } from 'react'
import { useForm, Controller } from "react-hook-form"
import { Check, ChevronsUpDown, EllipsisVertical } from "lucide-react"
import { useOrganization } from '@clerk/clerk-react'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useNavigate } from 'react-router-dom'
import { Badge } from "./ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card'
import { Checkbox } from './ui/checkbox'
import { ListTodo, Trophy, Flame, Settings, Plus, Play, Menu } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import axios from '../lib/axios.js'
import { Form, FormItem, FormLabel, FormMessage } from './ui/form'
import { frame } from 'framer-motion'
import { useAuth } from '@clerk/clerk-react'

const ProjectsList = () => {
    const { organization, isLoaded } = useOrganization();
    const [members, setMembers] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrganizationMembers = async () => {
            if (organization) {
                try {
                    console.log('Fetching members for organization:', organization.id);
                    const memberList = await organization.getMemberships();
                    setMembers(memberList.data || []);
                } catch (error) {
                    console.error('Error fetching organization members:', error);
                    setError(error.message);
                    setMembers([]);
                }
            }
        };

        fetchOrganizationMembers();
    }, [organization]);

    if (!isLoaded) {
        return <div className='flex items-center justify-center h-screen w-full'>
            <div className='loader'></div>
        </div>;
    }

    if (!organization) {
        return <div>No organization selected</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }



    const formattedMembers = members.map(member => {

        return {
            value: member.publicUserData?.userId || '',
            label: `${member.publicUserData?.firstName || ''} ${member.publicUserData?.lastName || ''}`.trim() || 'Unknown User'
        };
    });



    const navigate = useNavigate()
    const [projects, setProjects] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState("")
    const [projectData, setProjectData] = useState({
        name: "",
        description: "",
        deadline: "",
        tag: "",
    });
    const { user } = useAuth();

    useEffect(() => {
        const fetchProjects = async () => {
            if (!organization) {
                console.log("no organization")
            };
            try {
                const res = await axios.get(`http://localhost:5000/api/projects?organizationId=${organization.id}`);
                setProjects(res.data);
                console.log(res.data)
            } catch (error) {
                console.log("error fetching projects", error);
            }
        }

        fetchProjects();
    }, [organization])

    const handleSetValue = (val) => {
        if (value.includes(val)) {
            value.splice(value.indexOf(val), 1);
            setValue(value.filter((item) => item !== val));
        } else {
            setValue(prevValue => [...prevValue, val]);
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProjectData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const truncateDescription = (text, limit) => {
        if (text.length > limit) {
            return text.slice(0, limit) + "...";
        }
        return text;
    }

    const handleProjectClick = (projectId) => {
        navigate(`/dashboard/projects/${projectId}/tasks`)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!organization) {
            console.log("No organization")
        };
        const updatedProjectData = {
            ...projectData,
            user: value,
            organizationId: organization.id,

        }

        try {
            console.log("clicked", updatedProjectData);
            const res = await axios.post("http://localhost:5000/api/projects", updatedProjectData);
            setProjectData({ name: "", user: "", deadline: "", tag: "", description: "" });
            setValue([]);
            setIsModalOpen(false);
            // Refresh the projects list
            const updatedProjects = await axios.get(`http://localhost:5000/api/projects?organizationId=${organization.id}`);
            setProjects(updatedProjects.data);
        } catch (error) {
            console.log("error creating project", error);
        }
    };

    return (
        <main className='flex-1 overflow-auto p-4 md:p-6'>
            <div className='grid gird-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
                <div className='flex h-[230px] items-center justify-center bg-muted/20 transition-colors hover:bg-muted/30 border-2 rounded-xl border-dotted'>
                    <Button variant="ghost" size="icon" onClick={() => setIsModalOpen(true)}>
                        <PlusIcon className="h-6 w-6" />
                        <span className='sr-only'>Add Project</span>
                    </Button>
                </div>
                {projects.map((project) => (
                    <Card key={project._id} onClick={() => handleProjectClick(project._id)} className="hover:cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900 rounded-xl">
                        <CardHeader className="flex flex-row items-center space-y-0 pb-2 flex-wrap ">
                            <CardTitle className="text-lg font-semibold flex-1">{project.name}</CardTitle>
                            {/* <Checkbox id={`project-${project.id}`} /> */}
                            <EllipsisVertical size={18} />
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <p className="text-sm text-muted-foreground mb-2">
                                {truncateDescription(project.description, 120)}
                            </p>
                        </CardContent>
                        <CardFooter className="pt-2 flex justify-between  ">
                            <span className="text-sm font-medium">Deadline: {project.timeEstimate}</span>
                            <Button onClick={() => handleProjectClick()} size="sm" variant="outline" className="bg-blue-500 text-white">
                                <Play size={16} className="mr-2" />
                                View
                            </Button>
                        </CardFooter>
                    </Card>
                ))}

            </div>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create Project</DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit}>
                        {/* Project Name */}
                        <div className="mb-4">
                            <Label htmlFor="name">Project Name</Label>
                            <Input
                                id="name"
                                name="name"
                                placeholder="Enter project name"
                                value={projectData.name}
                                onChange={handleInputChange}
                            />
                        </div>

                        {/* Assign to User */}
                        <div className="mb-4">
                            <Label className="mb-4" htmlFor="description">Project description</Label>
                            <Textarea
                                id="description"
                                name="description"
                                placeholder="Enter project description"
                                value={projectData.description}
                                onChange={handleInputChange}
                            />
                        </div>

                        {/* Deadline */}
                        <div className="mb-4">
                            <Label htmlFor="deadline">Deadline</Label>
                            <Input
                                id="deadline"
                                name="deadline"
                                type="date"
                                value={projectData.deadline}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="mb-4">
                            <Label htmlFor="tag">Tag</Label>
                            <Input
                                id="tag"
                                name="tag"
                                value={projectData.tag}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="mb-4">
                            <Popover open={open} onOpenChange={setOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={open}
                                        className="w-[480px] justify-between"
                                    >
                                        <div className="flex gap-2 justify-start">
                                            {value?.length ?
                                                value.map((val, i) => (
                                                    <div key={i} className="px-2 py-1 rounded-xl border bg-slate-200 text-xs font-medium">
                                                        {formattedMembers.find((user) => user.value === val)?.label}
                                                    </div>
                                                ))
                                                : "Select user..."}
                                        </div>
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[200px] p-0">
                                    <Command>
                                        <CommandInput placeholder="Search user..." />
                                        <CommandList>
                                            <CommandEmpty>No user found.</CommandEmpty>
                                            <CommandGroup>
                                                {formattedMembers.map((user) => (
                                                    <CommandItem
                                                        key={user.value}
                                                        value={user.value}
                                                        onSelect={() => {
                                                            handleSetValue(user.value)
                                                        }}
                                                    >
                                                        <Check
                                                            className={cn(
                                                                "mr-2 h-4 w-4",
                                                                value.includes(user.value) ? "opacity-100" : "opacity-0"
                                                            )}
                                                        />
                                                        {user.label}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </div>

                        <DialogFooter>
                            <Button type="submit" className="bg-blue-500 text-white">Add a project</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

        </main>
    )
}

function ListIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <line x1="8" x2="21" y1="6" y2="6" />
            <line x1="8" x2="21" y1="12" y2="12" />
            <line x1="8" x2="21" y1="18" y2="18" />
            <line x1="3" x2="3.01" y1="6" y2="6" />
            <line x1="3" x2="3.01" y1="12" y2="12" />
            <line x1="3" x2="3.01" y1="18" y2="18" />
        </svg>
    )
}


function PlayIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polygon points="6 3 20 12 6 21 6 3" />
        </svg>
    )
}


function PlusIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M5 12h14" />
            <path d="M12 5v14" />
        </svg>
    )
}

export default ProjectsList