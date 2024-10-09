"use client"

import React, { useState, useEffect } from 'react';
import { Bell, Search, Users, Settings, BarChart2, FileText, Lock, DownloadIcon, PrinterIcon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useOrganization } from '@clerk/clerk-react';
import axios from 'axios'; // Make sure axios is installed and imported

export default function AdminDashboard() {
    const [selectedUser, setSelectedUser] = useState(null);
    const [userPerformance, setUserPerformance] = useState(null);
    const { organization, isLoaded: orgIsLoaded } = useOrganization();
    const [members, setMembers] = useState([]);
    const [userData, setUserData] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            if (organization) {
                try {
                    const [memberList, userDataResponse] = await Promise.all([
                        organization.getMemberships(),
                        axios.get('http://localhost:5000/api/userdata') // Adjust the URL as needed
                    ]);

                    setMembers(memberList.data || []);
                    setUserData(userDataResponse.data);
                } catch (error) {
                    console.error('Error fetching data:', error);
                    setError(error.message);
                }
            }
        };
        fetchData();
        console.log(userPerformance);
    }, [organization]);

    const handleViewPerformance = async (user) => {
        setSelectedUser(user);
        try {
            const response = await axios.get(`http://localhost:5000/api/userdata/${user.publicUserData?.userId}`);
            setUserPerformance(response.data);
        } catch (error) {
            console.error('Error fetching user performance:', error);
            setError('Failed to fetch user performance');
        }
    };

    const downloadCSV = (user) => {
        if (!user || !userPerformance) return;

        const headers = ['Metric', 'Value'];
        const csvData = [
            ['Name', `${user.publicUserData?.firstName} ${user.publicUserData?.lastName}`],
            ['Email', user.publicUserData?.emailAddress],
            ['Attend', userPerformance.contributionTypes?.attend || 0],
            ['Support', userPerformance.contributionTypes?.support || 0],
            ['Own', userPerformance.contributionTypes?.own || 0],
        ];

        const monthlyData = userPerformance.monthlyData || [];
        monthlyData.forEach(month => {
            csvData.push([`${month.month} - Timebox Score`, month.timeboxScore]);
            csvData.push([`${month.month} - Time Completed`, month.timeCompleted]);
        });

        const csvContent = [
            headers.join(','),
            ...csvData.map(row => row.join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `${user.publicUserData?.firstName}_${user.publicUserData?.lastName}_performance.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    if (!orgIsLoaded) {
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

    // Combine Clerk member data with user data from your database
    const combinedData = members.map(member => {
        const userDataEntry = userData.find(data => data.userId === member.publicUserData?.userId);
        return {
            ...member,
            userData: userDataEntry || {}
        };
    });

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}


            {/* Main content */}
            <main className="flex-1 p-8 overflow-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-semibold">Organization Users</h1>
                    <div className="flex items-center space-x-4">
                        <Input type="text" placeholder="Search users..." className="w-64" />
                        <Button>
                            <Search className="mr-2 h-4 w-4" />
                            Search
                        </Button>
                        <Button variant="outline">
                            <Bell className="h-4 w-4" />
                        </Button>
                        <Avatar>
                            <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User avatar" />
                            <AvatarFallback>AD</AvatarFallback>
                        </Avatar>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle>User List</CardTitle>
                        </div>
                        <CardDescription>Manage and view user timeboxing performance</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Attend</TableHead>
                                    <TableHead>Support</TableHead>
                                    <TableHead>Own</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {combinedData.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell>{user.publicUserData?.firstName} {user.publicUserData?.lastName}</TableCell>
                                        <TableCell>{user.role || 'N/A'}</TableCell>
                                        <TableCell>{user.publicUserData?.emailAddress}</TableCell>
                                        <TableCell>
                                            <span className={`px-2 py-1 rounded-full text-xs ${user.status === 'active' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                                                {user.status || 'N/A'}
                                            </span>
                                        </TableCell>
                                        <TableCell>{user.userData.contributionTypes?.attend || 0}</TableCell>
                                        <TableCell>{user.userData.contributionTypes?.support || 0}</TableCell>
                                        <TableCell>{user.userData.contributionTypes?.own || 0}</TableCell>
                                        <TableCell>
                                            <Button variant="ghost" onClick={() => handleViewPerformance(user)}>View Performance</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {selectedUser && userPerformance && (
                    <Card className="mt-8">
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <CardTitle>{selectedUser.publicUserData?.firstName} {selectedUser.publicUserData?.lastName}'s Performance</CardTitle>
                                <div className="space-x-2">
                                    <Button onClick={() => downloadCSV(selectedUser)} className="bg-blue-500 hover:bg-blue-600">
                                        <DownloadIcon className="mr-2 h-4 w-4" /> Download CSV
                                    </Button>
                                    <Button onClick={handlePrint} className="bg-gray-500 hover:bg-gray-600">
                                        <PrinterIcon className="mr-2 h-4 w-4" /> Print
                                    </Button>
                                </div>
                            </div>
                            <CardDescription>View detailed timeboxing metrics and contribution types</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-3 gap-4 mb-8">
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-medium text-muted-foreground">Attend</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{userPerformance.contributionTypes?.attend || 0}</div>
                                        <p className="text-xs text-muted-foreground">Tasks attended</p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-medium text-muted-foreground">Own</CardTitle>
                                    </CardHeader>
                                    <CardContent>

                                        <div className="text-2xl font-bold">{userPerformance.contributionTypes?.own || 0}</div>
                                        <p className="text-xs text-muted-foreground">Tasks personally managed</p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-medium text-muted-foreground">Support</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{userPerformance.contributionTypes?.support || 0}</div>
                                        <p className="text-xs text-muted-foreground">Tasks helped run</p>
                                    </CardContent>
                                </Card>
                            </div>
                            <Card className="mb-8">
                                <CardHeader>
                                    <CardTitle>Contribution Types</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-[200px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={[userPerformance.contributionTypes]}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="name" />
                                                <YAxis />
                                                <Tooltip />
                                                <Legend />
                                                <Bar dataKey="attend" fill="#8884d8" name="Attend" />
                                                <Bar dataKey="support" fill="#82ca9d" name="Support" />
                                                <Bar dataKey="own" fill="#ffc658" name="Own" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Monthly Contribution Performance</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-[400px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={userPerformance.monthlyData || []}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="month" />
                                                <YAxis />
                                                <Tooltip />
                                                <Legend />
                                                <Line type="monotone" dataKey="attend" stroke="#8884d8" name="Attend" />
                                                <Line type="monotone" dataKey="support" stroke="#82ca9d" name="Support" />
                                                <Line type="monotone" dataKey="own" stroke="#ffc658" name="Own" />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </CardContent>
                            </Card>
                        </CardContent>
                    </Card>
                )}
            </main>
        </div>
    )
}