import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useCallback, useState, useEffect } from 'react';
import { Dialog, DialogHeader, DialogTitle, DialogContent, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import '@/index.css';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectItem, SelectTrigger } from '@/components/ui/select';
import { SelectValue } from '@radix-ui/react-select';
import { SelectContent } from '@radix-ui/react-select';
import ModalNewTask from '@/components/ModalNewEvent';
import { Button } from '@/components/ui/button';
import { Portal } from '@radix-ui/react-dialog';
import axios from 'axios';
import { ChevronLeft, ChevronRight, Pencil, Trash2 } from 'lucide-react'; // Import icons
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserButton, useUser } from '@clerk/clerk-react';
import useEventStore from '@/stores/useEventStore';


const getEventColor = (contributionType) => {
    switch (contributionType) {
        case 'Attend': return 'bg-blue-400 text-blue-800'
        case 'Support': return 'bg-green-100 text-green-800'
        case 'Own': return 'bg-green-500 text-white'
        default: return 'bg-gray-200 text-gray-800'
    }
}

const localizer = momentLocalizer(moment);

const contributionType = ['None', 'Attend', 'Support', 'Own'];

const CalendarComponent = () => {
    const { events, setEvents, addEvent } = useEventStore();
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [eventName, setEventName] = useState('');
    const [selectedContributionType, setSelectedContributionType] = useState('');
    const [view, setView] = useState('calendar');
    const [currentDate, setCurrentDate] = useState(new Date());
    const { user } = useUser();
    const [selectedEvent, setSelectedEvent] = useState(null);

    useEffect(() => {
        fetchEvents();
    }, [user]);

    const fetchEvents = async () => {
        if (user) {
            try {
                const response = await axios.get(`http://localhost:5000/api/events/${user.id}`);
                const formattedEvents = response.data.map(event => ({
                    ...event,
                    start: new Date(event.start),
                    end: new Date(event.end)
                }));
                setEvents(formattedEvents);
            } catch (error) {
                console.error('Error fetching events:', error);
            }
        }
    };

    const handleSelectSlot = useCallback((slotInfo) => {
        setSelectedSlot(slotInfo)
        setEventName('')
        setSelectedContributionType('')
    }, [])

    const updateStreak = async () => {
        if (user) {
            try {
                await axios.post(`http://localhost:5000/api/streaks/${user.id}/update`);
            } catch (error) {
                console.error('Error updating streak:', error);
            }
        }
    };

    const handleCreateEvent = async () => {
        if (eventName && selectedContributionType && selectedSlot) {
            const newEvent = {
                title: `${eventName} (${selectedContributionType})`,
                start: selectedSlot.start,
                end: selectedSlot.end,
                contributionType: selectedContributionType,
                userId: user.id
            }
            try {
                const response = await axios.post('http://localhost:5000/api/events', newEvent);
                if (response.status === 201) {
                    const createdEvent = {
                        ...response.data,
                        start: new Date(response.data.start),
                        end: new Date(response.data.end)
                    };
                    addEvent(createdEvent);
                    setSelectedSlot(null);
                    setEventName('');
                    setSelectedContributionType('');
                    await updateStreak();
                }
            } catch (error) {
                console.error('Error creating event:', error);
            }
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('submit');
    };

    const handleNavigate = async (newDate) => {
        setCurrentDate(newDate);
        await updateStreak(); // Update streak when navigating to a new date
    };

    const eventStyleGetter = (event, start, end, isSelected) => {
        return {
            className: `${getEventColor(event.contributionType)} rounded-md px-2 py-1 text-xs font-semibold`,
        };
    };

    // Add this new function
    const slotStyleGetter = (date) => {
        return {
            className: 'custom-slot-style',
        };
    };

    const handleSelectEvent = useCallback((event) => {
        setSelectedEvent(event);
        setEventName(event.title.split(' (')[0]);
        setSelectedContributionType(event.contributionType);
    }, []);

    const handleUpdateEvent = async () => {
        if (eventName && selectedContributionType && selectedEvent) {
            const updatedEvent = {
                ...selectedEvent,
                title: `${eventName} (${selectedContributionType})`,
                contributionType: selectedContributionType,
            };
            try {
                // Use selectedEvent._id instead of selectedEvent.id
                const response = await axios.put(`http://localhost:5000/api/events/${selectedEvent._id}`, updatedEvent);
                if (response.status === 200) {
                    const updatedEventData = {
                        ...response.data,
                        start: new Date(response.data.start),
                        end: new Date(response.data.end)
                    };
                    setEvents(events.map(e => e._id === updatedEventData._id ? updatedEventData : e));
                    setSelectedEvent(null);
                    setEventName('');
                    setSelectedContributionType('');
                }
            } catch (error) {
                console.error('Error updating event:', error);
            }
        }
    };

    const handleDeleteEvent = async () => {
        if (selectedEvent) {
            try {
                await axios.delete(`http://localhost:5000/api/events/${selectedEvent._id}`);
                setEvents(events.filter(e => e.id !== selectedEvent._id));
                setSelectedEvent(null);
                setEventName('');
                setSelectedContributionType('');
            } catch (error) {
                console.error('Error deleting event:', error);
            }
        }

    };

    return (
        <div className="h-screen p-4 bg-gray-100 dark:bg-gray-900">
            <div className="flex justify-between items-center mb-4">
                <CustomToolbar date={currentDate} onNavigate={handleNavigate} />
                <Tabs value={view} onValueChange={setView}>
                    <TabsList className="bg-white dark:bg-gray-800 border dark:border-gray-700">
                        <TabsTrigger
                            value="calendar"
                            className="data-[state=active]:bg-[var(--primary-purple)] data-[state=active]:text-white"
                        >
                            Calendar
                        </TabsTrigger>
                        <TabsTrigger
                            value="list"
                            className="data-[state=active]:bg-[var(--primary-purple)] data-[state=active]:text-white"
                        >
                            List
                        </TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 border dark:border-gray-700">
                {view === 'calendar' ? (
                    <Calendar
                        selectable
                        localizer={localizer}
                        events={events}
                        defaultView="week"
                        views={['month', 'week', 'day']}
                        step={30}
                        timeslots={1}
                        style={{ height: 'calc(100vh - 200px)' }}
                        onSelectSlot={handleSelectSlot}
                        eventPropGetter={eventStyleGetter}
                        slotPropGetter={slotStyleGetter}
                        date={currentDate}
                        onNavigate={handleNavigate}
                        onSelectEvent={handleSelectEvent}
                        components={{
                            toolbar: () => null,
                        }}
                        className="dark:text-gray-200"
                        dayPropGetter={(date) => ({
                            className: 'dark:bg-gray-800 dark:text-gray-200',
                        })}
                    />
                ) : (
                    <ListView events={events} />
                )}
            </div>

            <Dialog open={!!selectedSlot || !!selectedEvent} onOpenChange={() => { setSelectedSlot(null); setSelectedEvent(null); }}>
                <DialogContent className="min-h-[370px]"> {/* or h-[600px] or h-full */}
                    <DialogHeader>
                        <DialogTitle>{selectedEvent ? 'Edit Task' : 'Create Task'}</DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit}>
                        {/* Project Name */}
                        <div className="mb-4">
                            <Label htmlFor="name">Task name</Label>
                            <Input
                                id="name"
                                name="name"
                                placeholder="Enter task name"
                                value={eventName}
                                onChange={(e) => setEventName(e.target.value)}
                            />
                        </div>

                        <div className='mb-4'>
                            <Label htmlFor="contributionType">Contribution Type</Label>
                            <Select onValueChange={setSelectedContributionType} value={selectedContributionType}>
                                <SelectTrigger id="contributionType">
                                    <SelectValue placeholder="Select contribution type" />
                                </SelectTrigger>
                                <SelectContent style={{ zIndex: 9999 }}>

                                    {contributionType.map((type) => (
                                        <SelectItem key={type} value={type}>
                                            {type}
                                        </SelectItem>
                                    ))}

                                </SelectContent>
                            </Select>
                        </div>

                        <DialogFooter>
                            {selectedEvent ? (
                                <>
                                    <Button type="button" onClick={handleUpdateEvent} className="bg-blue-500 text-white">
                                        <Pencil className="mr-2 h-4 w-4" /> Update Task
                                    </Button>
                                    <Button type="button" onClick={handleDeleteEvent} className="bg-red-500 text-white">
                                        <Trash2 className="mr-2 h-4 w-4" /> Delete Task
                                    </Button>
                                </>
                            ) : (
                                <Button type="submit" onClick={handleCreateEvent} className="bg-blue-500 text-white">
                                    Add Task
                                </Button>
                            )}
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>

    );
};

const CustomToolbar = ({ date, onNavigate }) => {
    const goToBack = () => {
        const newDate = new Date(date);
        newDate.setDate(newDate.getDate() - 7);
        onNavigate(newDate);
    };

    const goToNext = () => {
        const newDate = new Date(date);
        newDate.setDate(newDate.getDate() + 7);
        onNavigate(newDate);
    };

    const getWeekNumber = (date) => {
        const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
        const dayNum = d.getUTCDay() || 7;
        d.setUTCDate(d.getUTCDate() + 4 - dayNum);
        const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    };

    return (
        <div className="flex items-center space-x-4 border dark:border-gray-700 rounded-lg p-1 bg-white dark:bg-gray-800">
            <button onClick={goToBack} className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white">
                <ChevronLeft size={20} />
            </button>
            <div className="flex items-center space-x-2">
                <span className="text-gray-600 dark:text-gray-300">📅</span>
                <span className=" font-semibold text-gray-800 dark:text-white">
                    This week · W{getWeekNumber(date)}
                </span>
            </div>
            <button onClick={goToNext} className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white">
                <ChevronRight size={20} />
            </button>
        </div>
    );
};

const ListView = ({ events }) => {
    // Group events by date
    const groupedEvents = events.reduce((acc, event) => {
        const date = moment(event.start).format('YYYY-MM-DD');
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(event);
        return acc;
    }, {});

    // Sort dates
    const sortedDates = Object.keys(groupedEvents).sort((a, b) => moment(a).diff(moment(b)));

    return (
        <div className="space-y-6">
            {sortedDates.map(date => (
                <div key={date} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border dark:border-gray-700">
                    <h2 className="bg-gray-100 dark:bg-gray-700 px-4 py-2 font-semibold text-gray-800 dark:text-white">
                        {moment(date).format('dddd, MMMM D, YYYY')}
                    </h2>
                    <ul className="divide-y divide-gray-200 dark:divide-gray-600">
                        {groupedEvents[date].sort((a, b) => moment(a.start).diff(moment(b.start))).map(event => (
                            <li key={event.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-150 ease-in-out">
                                <div className="flex justify-between items-center">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-medium text-gray-800 dark:text-white">{event.title}</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-300">
                                            {moment(event.start).format('h:mm A')} - {moment(event.end).format('h:mm A')}
                                            <span className="ml-2 text-gray-500 dark:text-gray-400">
                                                ({moment.duration(moment(event.end).diff(moment(event.start))).asHours().toFixed(1)} hours)
                                            </span>
                                        </p>
                                        {event.contributionType && (
                                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                                                Contribution: {event.contributionType}
                                            </p>
                                        )}
                                    </div>
                                    <ChevronRight className="text-gray-400 dark:text-gray-500" size={20} />
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
};



export default CalendarComponent;



