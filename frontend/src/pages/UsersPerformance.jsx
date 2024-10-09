import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useOrganization } from '@clerk/clerk-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Button } from "@/components/ui/button";
import { DownloadIcon, PrinterIcon } from "lucide-react";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Add this function at the top of your file, outside the component
const calculateMonthlyKPI = (monthData, totalContributions) => {
    const hoursCompleted = monthData.timeCompleted / 60;
    const contributionScore = totalContributions.attend + totalContributions.support * 2 + totalContributions.own * 3;
    return ((hoursCompleted * 0.5) + (contributionScore * 0.3) + (monthData.streak * 0.2)).toFixed(2);
};

export default function UsersPerformance() {
    const [usersPerformance, setUsersPerformance] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { organization, isLoaded } = useOrganization();
    const [activeTab, setActiveTab] = useState('charts');

    useEffect(() => {
        const fetchUsersPerformance = async () => {
            if (!isLoaded || !organization) return;

            try {
                // Fetch performance data from your backend
                const performanceResponse = await axios.get('http://localhost:5000/api/admin/users-performance');
                const performanceData = performanceResponse.data;

                // Fetch organization members
                const memberList = await organization.getMemberships();

                // Combine organization member data with performance data
                const combinedData = memberList.data.map(member => {
                    const performanceUser = performanceData.find(p => p.userId === member.publicUserData.userId) || {
                        totalTimeCompleted: 0,
                        currentStreak: 0,
                        contributionTypes: { attend: 0, support: 0, own: 0 },
                        monthlyData: []
                    };

                    return {
                        userId: member.publicUserData.userId,
                        name: `${member.publicUserData.firstName} ${member.publicUserData.lastName}`.trim() || 'Unknown',
                        email: member.publicUserData.emailAddress || 'No email',
                        ...performanceUser
                    };
                });

                setUsersPerformance(combinedData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching users performance:', error);
                setError('Failed to fetch users performance');
                setLoading(false);
            }
        };

        fetchUsersPerformance();
    }, [isLoaded, organization]);

    const downloadCSV = () => {
        const headers = ['Name', 'Email', 'Total Time Completed (hours)', 'Current Streak', 'Attend', 'Support', 'Own'];
        const csvData = usersPerformance.map(user => [
            user.name,
            user.email,
            (user.totalTimeCompleted / 60).toFixed(2), // Convert minutes to hours
            user.currentStreak,
            user.contributionTypes.attend,
            user.contributionTypes.support,
            user.contributionTypes.own
        ]);

        const csvContent = [
            headers.join(','),
            ...csvData.map(row => row.join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', 'users_performance.csv');
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const calculateKPI = (user) => {
        const hoursCompleted = user.totalTimeCompleted / 60;
        const contributionScore = user.contributionTypes.attend + user.contributionTypes.support * 2 + user.contributionTypes.own * 3;
        return ((hoursCompleted * 0.5) + (contributionScore * 0.3) + (user.currentStreak * 0.2)).toFixed(2);
    };

    // Add this inside your component, before the return statement
    const prepareMonthlyKPIData = () => {
        const allMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        return allMonths.map(month => {
            const monthData = { month };
            usersPerformance.forEach(user => {
                const userMonthData = user.monthlyData.find(m => m.month === month) || {
                    timeCompleted: 0,
                    streak: 0,
                    timeboxScore: 0
                };
                const kpi = calculateMonthlyKPI(userMonthData, user.contributionTypes);
                monthData[user.name] = parseFloat(kpi);
            });
            return monthData;
        });
    };

    const monthlyKPIData = prepareMonthlyKPIData();

    if (loading || !isLoaded) return <div className='flex items-center justify-center h-screen w-full'>
        <div className='loader'></div>
    </div>;
    if (error) return <div>Error: {error}</div>;
    if (!usersPerformance.length) return <div>No data available</div>;

    // Calculate total time completed by all users (in hours)
    const totalTimeCompleted = usersPerformance.reduce((sum, user) => sum + user.totalTimeCompleted, 0) / 60;

    // Prepare data for contribution type chart
    const contributionTypeData = [
        { name: 'Attend', value: usersPerformance.reduce((sum, user) => sum + user.contributionTypes.attend, 0) },
        { name: 'Support', value: usersPerformance.reduce((sum, user) => sum + user.contributionTypes.support, 0) },
        { name: 'Own', value: usersPerformance.reduce((sum, user) => sum + user.contributionTypes.own, 0) },
    ];

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold">Users Performance Overview</h1>
                <div className="space-x-2 flex items-center">
                    <Button onClick={downloadCSV} className="bg-blue-500 hover:bg-blue-600">
                        <DownloadIcon className="mr-2 h-4 w-4" /> Download CSV
                    </Button>
                    <Button onClick={handlePrint} className="bg-gray-500 hover:bg-gray-600">
                        <PrinterIcon className="mr-2 h-4 w-4" /> Print
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{usersPerformance.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Time Completed</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalTimeCompleted.toFixed(2)} hours</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Average Time per User</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{(totalTimeCompleted / usersPerformance.length).toFixed(2)} hours</div>
                    </CardContent>
                </Card>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
                <TabsList>
                    <TabsTrigger value="charts">Charts</TabsTrigger>
                    <TabsTrigger value="list">List</TabsTrigger>
                </TabsList>

                <TabsContent value="charts">
                    <div className="grid grid-cols-2 gap-8 mb-8">
                        <Card>
                            <CardHeader>
                                <CardTitle>Time Completed by each User</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={usersPerformance}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="totalTimeCompleted" fill="#8884d8" name="Time Completed (minutes)" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Contribution Types Distribution</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={contributionTypeData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {contributionTypeData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Monthly KPI Trends</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={400}>
                                <LineChart data={monthlyKPIData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    {usersPerformance.map((user, index) => (
                                        <Line
                                            key={user.userId}
                                            type="monotone"
                                            dataKey={user.name}
                                            stroke={`hsl(${index * 137.5 % 360}, 70%, 50%)`}
                                            activeDot={{ r: 8 }}
                                        />
                                    ))}
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="list">
                    <Card>
                        <CardHeader>
                            <CardTitle>User Performance List</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Hours Worked</TableHead>
                                        <TableHead>Current Streak</TableHead>
                                        <TableHead>Attend</TableHead>
                                        <TableHead>Support</TableHead>
                                        <TableHead>Own</TableHead>
                                        <TableHead>KPI</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {usersPerformance.map((user) => (
                                        <TableRow key={user.userId}>
                                            <TableCell>{user.name}</TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell>{(user.totalTimeCompleted / 60).toFixed(2)}</TableCell>
                                            <TableCell>{user.currentStreak}</TableCell>
                                            <TableCell>{user.contributionTypes.attend}</TableCell>
                                            <TableCell>{user.contributionTypes.support}</TableCell>
                                            <TableCell>{user.contributionTypes.own}</TableCell>
                                            <TableCell>{calculateKPI(user)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}