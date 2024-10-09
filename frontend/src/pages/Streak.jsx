import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Flame, Trophy, ListTodo, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { useUser } from '@clerk/clerk-react';

export default function WritingStats() {
    const [loading, setLoading] = useState(true);
    const [streakData, setStreakData] = useState({
        currentStreak: 0,
        totalTasksCompleted: 0,
        tasksThisWeek: 0
    });
    const { user } = useUser();

    useEffect(() => {
        const fetchStreakData = async () => {
            if (user) {
                try {
                    const response = await axios.get(`http://localhost:5000/api/streaks/${user.id}`);
                    setStreakData(response.data);
                } catch (error) {
                    console.error('Error fetching streak data:', error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchStreakData();
    }, [user]);

    if (loading) {
        return <div className='flex items-center justify-center h-screen w-full'>
            <div className='loader'></div>
        </div>;
    }

    const currentDate = new Date();
    const currentMonth = currentDate.toLocaleString('default', { month: 'short' });
    const currentYear = currentDate.getFullYear();

    return (
        <div className="container mx-auto p-4 space-y-4 dark:bg-black dark:text-white">
            <h1 className="text-2xl font-bold mb-6">My Task Stats</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <StatCard
                    title="Current Streak"
                    value={`${streakData.currentStreak} days`}
                    icon={<Flame className="h-6 w-6 text-orange-500" />}
                    description="Keep it up!"
                />
                <StatCard
                    title="Total Time worked"
                    value={streakData.totalTasksCompleted.toString()}
                    icon={<Trophy className="h-6 w-6 text-yellow-500" />}
                    description="All-time record"
                />
                <StatCard
                    title="Time this Week"
                    value={streakData.tasksThisWeek.toString()}
                    icon={<ListTodo className="h-6 w-6 text-blue-500" />}
                    description="Keep the momentum going!"
                />
            </div>

            <Card className=" mt-6">
                <CardHeader>
                    <CardTitle className="dark:text-white">{currentMonth} {currentYear} • 2,234 w</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-7 gap-2">
                        {[...Array(31)].map((_, i) => (
                            <Badge
                                key={i}
                                variant={Math.random() > 0.5 ? "default" : "secondary"}
                                className={`w-8 h-8 rounded-full flex items-center justify-center ${Math.random() > 0.5
                                    ? 'bg-[#395bf3] dark:text-white text-white'
                                    : 'bg-white text-[#604aef] border border-[#395bf3]'
                                    }`}
                            >
                                {i + 1}
                            </Badge>
                        ))}
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">This Month</span>
                    <Button variant="outline" size="sm">View Details</Button>
                </CardFooter>
            </Card>
        </div>
    );
}

function StatCard({ title, value, icon, description }) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <p className="text-xs text-muted-foreground">{description}</p>
            </CardContent>
        </Card>
    );
}

function DateGrid() {
    return (
        <div className="grid grid-cols-7 gap-1">
            {[...Array(31)].map((_, i) => (
                <Badge
                    key={i}
                    variant={Math.random() > 0.5 ? "default" : "secondary"}
                    className={`w-4 h-4 rounded-sm flex items-center justify-center text-[0.5rem] ${Math.random() > 0.5
                        ? 'bg-[#604aef] dark:text-white'
                        : 'bg-white text-[#604aef] border border-[#604aef]'
                        }`}
                >
                    {i + 1}
                </Badge>
            ))}
        </div>
    );
}