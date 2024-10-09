'use client'

import { Calendar, momentLocalizer, Views } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { useCallback, useState, useEffect } from 'react'
import { Dialog, DialogHeader, DialogTitle, DialogContent, DialogFooter } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'

const localizer = momentLocalizer(moment)

const initialContributionTypes = ['None', 'Attend', 'Support', 'Own']

const getEventColor = (event) => {
    if (event.completed) return 'bg-green-500 dark:bg-green-700 text-white'
    if (moment(event.end).isBefore(moment())) return 'bg-red-500 dark:bg-red-700 text-white'
    return 'bg-blue-500 dark:bg-blue-700 text-white'
}

const holidays = [
    { date: '2024-01-01', name: 'New Year\'s Day' },
    { date: '2024-12-25', name: 'Christmas Day' },
    // Add more holidays here
]

export default function EnhancedInteractiveCalendar() {
    const [events, setEvents] = useState([])
    const [selectedSlot, setSelectedSlot] = useState(null)
    const [selectedEvent, setSelectedEvent] = useState(null)
    const [eventName, setEventName] = useState('')
    const [selectedContributionType, setSelectedContributionType] = useState('')
    const [customContributionType, setCustomContributionType] = useState('')
    const [contributionTypes, setContributionTypes] = useState(initialContributionTypes)
    const [progress, setProgress] = useState({})
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [currentView, setCurrentView] = useState(Views.MONTH)
    const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false)
    const [updateMessage, setUpdateMessage] = useState('')
    const [updateType, setUpdateType] = useState('team')
    const [completionStatus, setCompletionStatus] = useState(false)
    const [issuesFaced, setIssuesFaced] = useState('')

    useEffect(() => {
        const interval = setInterval(() => {
            updateProgress()
            updateEventStatus()
        }, 60000) // Update every minute

        return () => clearInterval(interval)
    }, [events])

    const updateProgress = () => {
        const now = moment()
        const progressData = {}

        // Calculate progress for each day in the current month
        const daysInMonth = now.daysInMonth()
        for (let day = 1; day <= daysInMonth; day++) {
            const date = moment(now).date(day)
            const dayTasks = events.filter(event => moment(event.start).isSame(date, 'day'))
            const completed = dayTasks.filter(event => event.completed).length
            const total = dayTasks.length
            progressData[date.format('YYYY-MM-DD')] = total > 0 ? (completed / total) * 100 : 0
        }

        setProgress(progressData)
    }

    const updateEventStatus = () => {
        const now = moment()
        setEvents(prevEvents => prevEvents.map(event => ({
            ...event,
            completed: event.completed || moment(event.end).isBefore(now)
        })))
    }

    const handleSelectSlot = useCallback((slotInfo) => {
        setSelectedSlot(slotInfo)
        setEventName('')
        setSelectedContributionType('')
        setCustomContributionType('')
        setCompletionStatus(false)
        setIssuesFaced('')
        setIsDialogOpen(true)
    }, [])

    const handleSelectEvent = useCallback((event) => {
        setSelectedEvent(event)
        setEventName(event.title)
        setSelectedContributionType(event.contributionType)
        setCompletionStatus(event.completed)
        setIssuesFaced(event.issuesFaced || '')
        setIsDialogOpen(true)
    }, [])

    const handleCreateEvent = () => {
        if (eventName && selectedSlot && (selectedContributionType || customContributionType)) {
            const contributionType = customContributionType || selectedContributionType
            const newEvent = {
                id: new Date().getTime().toString(),
                title: eventName,
                start: selectedSlot.start,
                end: selectedSlot.end,
                contributionType: contributionType,
                completed: completionStatus,
                issuesFaced: issuesFaced,
                userId: '123'
            }

            setEvents(prev => [...prev, newEvent])
            setIsDialogOpen(false)
            setSelectedSlot(null)
            setEventName('')
            setSelectedContributionType('')
            setCustomContributionType('')
            setCompletionStatus(false)
            setIssuesFaced('')
            updateProgress()
        }
    }

    const handleUpdateEvent = () => {
        if (selectedEvent) {
            setEvents(prev => prev.map(event =>
                event.id === selectedEvent.id ? {
                    ...selectedEvent,
                    title: eventName,
                    contributionType: selectedContributionType || customContributionType,
                    completed: completionStatus,
                    issuesFaced: issuesFaced
                } : event
            ))
            setIsDialogOpen(false)
            setSelectedEvent(null)
            setEventName('')
            setSelectedContributionType('')
            setCustomContributionType('')
            setCompletionStatus(false)
            setIssuesFaced('')
            updateProgress()
        }
    }

    const eventStyleGetter = (event) => {
        return {
            className: `${getEventColor(event)} rounded-md px-2 py-1 text-xs font-semibold`,
        }
    }

    const EventComponent = ({ event }) => (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div className="truncate">{event.title}</div>
                </TooltipTrigger>
                <TooltipContent>
                    <div>
                        <p><strong>Task:</strong> {event.title}</p>
                        <p><strong>Type:</strong> {event.contributionType}</p>
                        <p><strong>Start:</strong> {moment(event.start).format('LT')}</p>
                        <p><strong>End:</strong> {moment(event.end).format('LT')}</p>
                        <p><strong>Status:</strong> {event.completed ? 'Completed' : 'In Progress'}</p>
                        {event.issuesFaced && <p><strong>Issues:</strong> {event.issuesFaced}</p>}
                    </div>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )

    const handleSendUpdate = () => {
        console.log(`Sending ${updateType} update: ${updateMessage}`)
        // Here you would typically send this update to a server
        setIsUpdateDialogOpen(false)
        setUpdateMessage('')
        setUpdateType('team')
    }

    return (
        <div className="h-screen p-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            <div className="mb-4 grid grid-cols-3 gap-4">
                <ProgressBar label="Daily Progress" value={progress[moment().format('YYYY-MM-DD')] || 0} color="bg-green-500" />
                <ProgressBar label="Weekly Progress" value={Object.values(progress).reduce((acc, val) => acc + val, 0) / 7} color="bg-yellow-500" />
                <ProgressBar label="Monthly Progress" value={Object.values(progress).reduce((acc, val) => acc + val, 0) / Object.keys(progress).length} color="bg-red-500" />
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="bg-white dark:bg-gray-800">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold">{selectedEvent ? 'Update Task' : 'Create Task'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={(e) => e.preventDefault()}>
                        <div className="mb-4">
                            <Label htmlFor="name" className="text-sm font-medium">Task name</Label>
                            <Input
                                id="name"
                                name="name"
                                placeholder="Enter task name"
                                value={eventName}
                                onChange={(e) => setEventName(e.target.value)}
                                className="mt-1"
                            />
                        </div>
                        <div className='mb-4'>
                            <Label htmlFor="contributionType" className="text-sm font-medium">Contribution Type</Label>
                            <Select onValueChange={setSelectedContributionType} value={selectedContributionType}>
                                <SelectTrigger id="contributionType" className="mt-1">
                                    <SelectValue placeholder="Select or enter new type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {contributionTypes.map((type) => (
                                        <SelectItem key={type} value={type}>
                                            {type}
                                        </SelectItem>
                                    ))}
                                    <SelectItem value="custom">Custom Type</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        {selectedContributionType === 'custom' && (
                            <div className="mb-4">
                                <Label htmlFor="customType" className="text-sm font-medium">Custom Type</Label>
                                <Input
                                    id="customType"
                                    name="customType"
                                    placeholder="Enter custom type"
                                    value={customContributionType}
                                    onChange={(e) => setCustomContributionType(e.target.value)}
                                    className="mt-1"
                                />
                            </div>
                        )}
                        <div className="mb-4">
                            <Label htmlFor="completionStatus" className="text-sm font-medium">Completion Status</Label>
                            <div className="flex items-center mt-1">
                                <Switch
                                    id="completionStatus"
                                    checked={completionStatus}
                                    onCheckedChange={setCompletionStatus}
                                />
                                <Label htmlFor="completionStatus" className="ml-2">
                                    {completionStatus ? 'Completed' : 'In Progress'}
                                </Label>
                            </div>
                        </div>
                        <div className="mb-4">
                            <Label htmlFor="issuesFaced" className="text-sm font-medium">Issues Faced</Label>
                            <Textarea
                                id="issuesFaced"
                                placeholder="Enter any issues faced"
                                value={issuesFaced}
                                onChange={(e) => setIssuesFaced(e.target.value)}
                                className="mt-1"
                            />
                        </div>
                        {selectedSlot && (
                            <div className="mb-4">
                                <Label className="text-sm font-medium">Selected Time</Label>
                                <p className="mt-1 text-sm">
                                    {`${moment(selectedSlot.start).format('MMMM D, YYYY h:mm A')} - ${moment(selectedSlot.end).format('h:mm A')}`}
                                </p>
                            </div>
                        )}
                        <DialogFooter>
                            <Button
                                onClick={selectedEvent ? handleUpdateEvent : handleCreateEvent}
                                className="bg-blue-500 hover:bg-blue-600 text-white"
                            >
                                {selectedEvent ? 'Update Task' : 'Add Task'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
            <div className="rounded-lg overflow-hidden shadow-lg mb-4">
                <Calendar
                    selectable
                    localizer={localizer}
                    events={events}
                    defaultView={currentView}
                    views={[Views.MONTH, Views.WEEK, Views.DAY]}
                    step={30}
                    timeslots={2}
                    style={{ height: 'calc(100vh - 300px)' }}
                    onSelectSlot={handleSelectSlot}
                    onSelectEvent={handleSelectEvent}
                    eventPropGetter={eventStyleGetter}
                    components={{
                        event: EventComponent
                    }}
                    className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    dayLayoutAlgorithm="no-overlap"
                    dayPropGetter={(date) => ({
                        className: `relative ${moment(date).isBefore(moment(), 'day') ? 'bg-gray-100 dark:bg-gray-700' : ''}`,
                    })}
                    onView={setCurrentView}
                    formats={{
                        dayFormat: (date, culture, localizer) =>
                            localizer.format(date, 'D', culture) +
                            (holidays.some(holiday => holiday.date === moment(date).format('YYYY-MM-DD'))
                                ? ' •'
                                : '')
                    }}
                />
            </div>
            {/* <Button onClick={() => setIsUpdateDialogOpen(true)} className="w-full">Send Update</Button> */}
            <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
                <DialogContent className="bg-white dark:bg-gray-800">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold">Send Update</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={(e) => e.preventDefault()}>
                        <div className="mb-4">
                            <Label htmlFor="updateType" className="text-sm font-medium">Update Type</Label>
                            <Select onValueChange={setUpdateType} value={updateType}>
                                <SelectTrigger id="updateType" className="mt-1">
                                    <SelectValue placeholder="Select update type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="team">Team Update</SelectItem>
                                    <SelectItem value="admin">Admin Update</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="mb-4">
                            <Label htmlFor="updateMessage" className="text-sm font-medium">Update Message</Label>
                            <Textarea
                                id="updateMessage"
                                placeholder="Enter your update message"
                                value={updateMessage}
                                onChange={(e) => setUpdateMessage(e.target.value)}
                                className="mt-1"
                            />
                        </div>
                        {/* <DialogFooter>
                            <Button onClick={handleSendUpdate} className="bg-blue-500 hover:bg-blue-600 text-white">
                                Send Update
                            </Button>
                        </DialogFooter> */}
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}

function ProgressBar({ label, value, color }) {
    return (
        <div>
            <Label className="text-sm font-medium mb-1">{label}</Label>
            <Progress value={value} className={`h-2 ${color}`} />
        </div>
    )
}