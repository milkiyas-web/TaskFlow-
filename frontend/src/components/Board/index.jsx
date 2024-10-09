import { useTaskStore } from '@/stores/useTaskStore'
import { Check, ChevronsUpDown, EllipsisVertical, MessageSquareMore, Plus } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { format, isValid } from "date-fns"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../components/ui/dialog'
import { Label } from '../../components/ui/label'
import { Input } from '../../components/ui/input'
import { Textarea } from '../../components/ui/textarea'
import man from "./images/avatar.jpg"

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
import { Skeleton } from '../ui/skeleton'
import { Button } from '../ui/button'
import { cn } from '@/lib/utils'
import axios from 'axios'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { useOrganization, useUser } from '@clerk/clerk-react'

const taskStatus = ["To Do", "Work In Progress", "Under Review", "Completed"]
const users = [
    {
        value: "emanuel",
        label: "Emannuel",
    },
    {
        value: "milkyas",
        label: "Milkyas",
    },
    {
        value: "mercy",
        label: "Mercy",
    },
    {
        value: "rediet",
        label: "Rediet",
    },
]
const initialTasks = [
    { id: 1, name: "Complete project proposal", description: "Write and review the Q3 project proposal", timeEstimate: "2 hours" },
    { id: 2, name: "Team meeting", description: "Weekly team sync-uppppppppppppppppppp", timeEstimate: "1 hour" },
    { id: 3, name: "Code review", description: "Review pull requests for the new feature", timeEstimate: "1.5 hours" },
]

const Board = ({ projectId }) => {
    const { tasks, isLoading, error, getTasks, setTasks, updateTaskStatus } = useTaskStore();

    useEffect(() => {
        getTasks(projectId);
    }, [projectId])
    //console.log("projectID", projectId)
    const moveTask = async (taskId, newStatus) => {
        console.log('before Update: ', tasks);
        const updatedTasks = tasks.map((task) =>
            task._id === taskId ? { ...task, status: newStatus } : task
        );

        console.log("Updated tasks:", updatedTasks);
        setTasks(updatedTasks);
        try {
            await axios.patch(`http://localhost:5000/api/projects/${projectId}/tasks/${taskId}`, { status: newStatus });
            console.log("Task status updated successfully");
        } catch (error) {
            console.error("Error updating task status: ", error.message)
        }
    };
    // TODO: modify the Skeleton
    if (isLoading) return <Skeleton className="w-[100px] h-[20px] rounded-full" />

    if (error) return <div className='flex justify-center items-center my-auto'>An error occurred while fetching tasks</div>
    return <DndProvider backend={HTML5Backend}>
        <div className='grid grid-cols gap-4 p-4 md:grid:cols-2 xl:grid-cols-4'>
            {taskStatus.map((status) => (
                <TaskColumn
                    key={status}
                    status={status}
                    tasks={tasks || []}
                    moveTask={moveTask}
                    projectId={projectId}

                // setIsModalNewTaskOpen={setIsModalNewTaskOpen}
                />
            ))}
        </div>
    </DndProvider>

}
const TaskColumn = ({
    status,
    tasks,
    moveTask,
    projectId,
}) => {
    const [{ isOver }, drop] = useDrop({
        accept: 'TASK',
        drop: (item) => moveTask(item.id, status),
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    });
    console.log("projectID", projectId)
    // const tasksCount = tasks.filter((task) => task.status === status).length;
    const tasksCount = Array.isArray(tasks) ? tasks.filter((task) => task.status === status).length : 0;


    const statusColor = {
        "To Do": "#2563EB",
        "Work In Progress": "#059669",
        "Under Review": "#D97706",
        "Completed": "#000000"
    };
    const [isModalOpen, setIsModalOpen] = useState(false)
    // const [newTasks, setNewProjects] = useState(initialTasks)
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState([])
    const [newTaskData, setNewTaskData] = useState({
        name: "",
        description: "",
        startDate: "",
        dueDate: "",
        tag: "",
        user: "",
        status: "",
        assignees: [],
    });
    const { organization, isLoaded } = useOrganization();
    const { user } = useUser();
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

    useEffect(() => {
        const fetchUserImages = async () => {
            if (tasks.assignee && tasks.assignee.userId) {
                try {
                    const assigneeUser = await organization.getUser(tasks.assignee.userId);
                    setAssigneeImage(assigneeUser.imageUrl);
                } catch (error) {
                    console.error("Error fetching assignee image:", error);
                }
            }
            if (tasks.author && tasks.author.userId) {
                try {
                    const authorUser = await organization.getUser(tasks.author.userId);
                    setAuthorImage(authorUser.imageUrl);
                } catch (error) {
                    console.error("Error fetching author image:", error);
                }
            }
        };

        fetchUserImages();
    }, [tasks, organization]);




    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewTaskData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSetValue = (userValue) => {
        // Ensure `value` is an array before performing operations
        if (!Array.isArray(value)) return;

        // Check if the user is already selected
        if (!value.includes(userValue)) {
            // Add the user if they aren't selected yet
            setValue([...value, userValue]);
            setNewTaskData((prevState) => ({
                ...prevState,
                assignees: [...prevState.assignees, userValue],
            }));
        } else {
            // Remove the user if they are already selected
            const updatedValue = value.filter((val) => val !== userValue);
            setValue(updatedValue);
            setNewTaskData((prevState) => ({
                ...prevState,
                assignees: updatedValue,
            }));
        }
    };

    const { addTask, isLoading } = useTaskStore();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!projectId) {
            console.error("Project ID is undefined");
            return;
        }

        // Assuming you have access to the current user's ID
        // const currentUserId = getCurrentUserId(); // Replace with your actual method of getting the current user's ID

        const currentUserId = user?.id;

        const taskData = {
            ...newTaskData,
            author: currentUserId, // Add this line to include the author
        };

        try {
            await addTask(projectId, taskData);
        } catch (error) {
            console.error("Error adding task: ", error.message);
        }

        // Reset form fields...
        setNewTaskData({
            title: "",
            description: "",
            startDate: "",
            dueDate: "",
            priority: "",
            user: "",
            status: "",
            assignees: [],
        });
        setValue([]);
    };


    return (
        <div
            ref={drop}
            className={`sl:py-4 rounded-lg py-2 xl:px-2  ${isOver ? "bg-blue-100 dark:bg-neutral-800/50" : ""}`}>
            <div className='mb-3 flex w-full'>
                <div
                    className={`w-2 !bg-[${statusColor[status]}] rounded-s-lg `}
                    style={{ backgroundColor: statusColor[status] }}
                />
                <div className='flex w-full items-center justify-between rounded-e-lg bg-gray-50 dark:bg-gray-900/50 px-5 py-4 dark:bg-dark-secondary '>
                    <h3 className='flex items-center text-lg font-semibold dark:text-white'>
                        {status}{" "}

                        <span className='ml-2 inline-block rounded-full bg-gray-200 dark:bg-gray-700 p-1 text-center text-sm leading-none dark:bg-dark-teritiary' style={{ width: "1.5rem", height: "1.5rem" }}>
                            {tasksCount}
                        </span>
                    </h3>
                    <div className='flex items-center gap-1'>
                        <button className='flex h-6 w-5 items-center justify-center dark:text-neutral-500'>
                            <EllipsisVertical size={16} />
                        </button>
                        <button onClick={() => setIsModalOpen(true)} className='flex h-6 w-6 items-center justify-center rounded dark:bg-gray-900/50 bg-gray-200 dark:bg-dark-teritiary dark:text-white'>
                            <Plus size={16} />
                        </button>

                    </div>
                </div>
            </div>
            {/* {tasks.filter((task) => task.status === status).map((task) => (
                <Task key={task.id} task={task} status={status} />
            ))} */}
            {Array.isArray(tasks) && tasks
                .filter((task) => task.status === status) // Ensure task has the correct status
                .map((task) => (
                    <Task key={task._id} task={task} />
                ))}

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create Task</DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit}>
                        {/* Project Name */}
                        <div className="mb-4">
                            <Label htmlFor="name">Task title</Label>
                            <Input
                                id="title"
                                name="title"
                                placeholder="Enter project name"
                                value={newTaskData.title}
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
                                value={newTaskData.description}
                                onChange={handleInputChange}
                            />
                        </div>

                        {/* Deadline */}
                        <div className="mb-4">
                            <Label htmlFor="deadline">Start Date</Label>
                            <Input
                                id="start-date"
                                name="startDate"
                                type="date"
                                value={newTaskData.startDate}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="mb-4">
                            <Label htmlFor="deadline">dueDate</Label>
                            <Input
                                id="end-date"
                                name="dueDate"
                                type="date"
                                value={newTaskData.dueDate}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="mb-4">
                            <Label htmlFor="priority">priority</Label>
                            <Input
                                id="priority"
                                name="priority"
                                value={newTaskData.priority}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="mb-4">
                            <Label htmlFor="status">Status</Label>
                            <Select
                                id="status"
                                name="status"
                                value={newTaskData.status}
                                onValueChange={(value) => setNewTaskData({ ...newTaskData, status: value })}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select a status" />
                                </SelectTrigger>
                                <SelectContent>
                                    {taskStatus.map((status) => (
                                        <SelectItem key={status} value={status}>
                                            {status}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
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
                            <Button type="submit" className="bg-blue-500 text-white" >
                                {/* Loading */}Add Task
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}

const Task = ({ task }) => {
    const { user } = useUser();
    const { organization } = useOrganization();
    const [assigneeImage, setAssigneeImage] = useState(null);
    const [authorImage, setAuthorImage] = useState(null);

    useEffect(() => {
        const fetchUserImages = async () => {
            if (task.assignee && task.assignee.userId) {
                try {
                    const assigneeUser = await organization.getUser(task.assignee.userId);
                    console.log("assigneeUser:", assigneeUser)
                    setAssigneeImage(assigneeUser.imageUrl);
                } catch (error) {
                    console.error("Error fetching assignee image:", error);
                }
            }
            if (task.author && task.author.userId) {
                try {
                    const authorUser = await organization.getUser(task.author.userId);
                    setAuthorImage(authorUser.imageUrl);
                } catch (error) {
                    console.error("Error fetching author image:", error);
                }
            }
        };

        fetchUserImages();
    }, [task, organization]);

    const [{ isDragging }, drag] = useDrag({
        type: 'TASK',
        item: { id: task._id },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const taskTagsSplit = Array.isArray(task.tags) ? task.tags : [];

    console.log('Raw startDate:', task.startDate);
    console.log('Raw dueDate:', task.dueDate);

    const formattedStartDate = task.startDate && isValid(new Date(task.startDate))
        ? format(new Date(task.startDate), 'yyyy-MM-dd')
        : '';
    const formattedDueDate = task.dueDate && isValid(new Date(task.dueDate))
        ? format(new Date(task.dueDate), '2024-MM-dd')
        : '';

    console.log('Formatted startDate:', formattedStartDate);
    console.log('Formatted dueDate:', formattedDueDate);
    const numberOfComments = (task.comments && task.comments.length) || 0;

    const PriorityTag = ({ priority }) => (
        <div className={`rounded-full px-2 py-1 text-xs font-semibold ${priority === "Urgent"
            ? "bg-red-300 text-red-900"
            : priority === "High"
                ? "bg-yellow-200 text-yellow-700"
                : priority === "Medium"
                    ? "bg-green-200 text-green-700"
                    : priority === "low"
                        ? "bg-blue-200 text-blue-700"
                        : "bg-gray-200 text-gray-700"
            }`}
        >
            {priority}
        </div>
    );
    return (
        <div ref={drag} className={`mb-4 rounded-md bg-gray-50 shadow dark:bg-gray-900/50 dark:text-gray-50 ${isDragging ? "opacity-50" : "opacity-100"
            }`}>
            {task.attachments && task.attachments.length > 0 && (
                <img
                    src={man}
                    alt='avatar'
                    width={400}
                    height={200}
                    className="h-auto w-full rounded-t-md"
                />
            )}
            <div className='p-4 md:p-6'>
                <div className='flex items-start justify-between'>
                    <div className='flex flex-1 flex-wrap items-center gap-2'>
                        {task.priority && <PriorityTag priority={task.priority} />}
                        {/* <div className='flex gap-2'>
                            {taskTagsSplit.map((tag) => (
                                <div className='rounded-full bg-blue-100 text-black px-2 py-1 text-xs' key={tag}>
                                    {" "}
                                    {tag}
                                </div>
                            ))}
                        </div> */}
                    </div>
                    <button className='flex h-6 w-4 flex-shrink-0 items-center justify-center dark:text-neutral-500'>
                        <EllipsisVertical size={26} />
                    </button>
                </div>

                <div className='my-3 flex justify-between'>
                    <h4 className='text-md font-bold dark:text-gray-300'>{task.title}</h4>
                    {typeof task.points === "number" && (
                        <div className='text-xs font-semibold dark:text-white'>
                            {task.points} pts
                        </div>
                    )}
                </div>
                <div className="text-xs text-gray-500 dark:text-neutral-500 mt-2">
                    {(formattedStartDate || formattedDueDate) && (
                        <span className="border border-blue-900 rounded px-1 py-1 mb-2">
                            {formattedStartDate && <span>{formattedStartDate}</span>}
                            {formattedStartDate && formattedDueDate && <span> - </span>}
                            {formattedDueDate && <span>{formattedDueDate}</span>}
                        </span>
                    )}
                </div>
                <p className='text-sm text-gray-600 dark:text-neutral-500 mt-2'>
                    {task.description}
                </p>
                <div className='mt-4 border-t border-gray-200 dark:border-stroke-dark' />

                {/*Users */}
                <div className='mt-3 flex items-center justify-between'>
                    <div className='flex -space-x-[6px] overflow-hidden'>
                        {task.assignee && assigneeImage && (
                            <img
                                key={task.assignee.userId}
                                src={assigneeImage}
                                alt={task.assignee.username || "Assignee"}
                                width={30}
                                height={30}
                                className='h-8 w-8 rounded-full border-2 border-white object-cover dark:border-dark-secondary'
                            />
                        )}
                        {task.author && authorImage && (
                            <img
                                key={task.author.userId}
                                src={authorImage}
                                alt={task.author.username || "Author"}
                                width={30}
                                height={30}
                                className='h-8 w-8 rounded-full border-2 border-white object-cover dark:border-dark-secondary'
                            />
                        )}
                    </div>
                    <div className='flex items-center text-gray-500 dark:text-neutral-500'>
                        <MessageSquareMore size={20} />
                        <span className='ml-1 text-sm dark:text-neutral-400'>
                            {numberOfComments}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}

const AddTaskModal = ({ isModalOpen, setIsModalOpen }) => {
    const [projects, setProjects] = useState(initialProjects)

    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState("")
    const [newTaskData, setProjectData] = useState({
        name: "",
        description: "",
        deadline: "",
        tag: "",
        user: ""
    });
    return (
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
                        <Label htmlFor="tag">priority</Label>
                        <Input
                            id="priority"
                            name="priority"
                            value={projectData.priority}
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
                                                <div key={i} className="px-2 py-1 rounded-xl border bg-slate-200 text-xs font-medium">{users.find((user) => user.value === val)?.label}</div>
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
                                            {users.map((user) => (
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
                        <Button type="submit" className="bg-green-500 text-white">Add a project</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default Board