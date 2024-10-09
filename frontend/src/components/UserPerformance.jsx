import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Button } from "@/components/ui/button";
import { DownloadIcon, PrinterIcon } from "lucide-react";

export default function UserPerformance() {
    const { userId } = useParams();
    const [userPerformance, setUserPerformance] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserPerformance = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/userdata/${userId}`);
                setUserPerformance(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching user performance:', error);
                setError('Failed to fetch user performance');
                setLoading(false);
            }
        };

        fetchUserPerformance();
    }, [userId]);

    const downloadCSV = () => {
        if (!userPerformance) return;

        const headers = ['Date', 'Time Completed (hours)', 'Timebox Score', 'Attend', 'Support', 'Own'];
        const csvData = userPerformance.monthlyData.map(data => [
            data.month,
            (data.timeCompleted / 60).toFixed(2),
            data.timeboxScore,
            userPerformance.contributionTypes.attend,
            userPerformance.contributionTypes.support,
            userPerformance.contributionTypes.own
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
            link.setAttribute('download', `${userPerformance.name}_performance.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    if (loading) return <div className='flex items-center justify-center h-screen w-full'>
        <div className='loader'></div>
    </div>;
    if (error) return <div>Error: {error}</div>;
    if (!userPerformance) return <div>No data available</div>;

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold">{userPerformance.name}'s Timeboxing Performance</h1>
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
                        <CardTitle className="text-sm font-medium text-muted-foreground">Contribution Types</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <div>
                                <span className="text-sm text-muted-foreground">Attend:</span>
                                <span className="text-lg font-bold ml-2">{userPerformance.contributionTypes.attend}</span>
                            </div>
                            <div>
                                <span className="text-sm text-muted-foreground">Own:</span>
                                <span className="text-lg font-bold ml-2">{userPerformance.contributionTypes.own}</span>
                            </div>
                            <div>
                                <span className="text-sm text-muted-foreground">Support:</span>
                                <span className="text-lg font-bold ml-2">{userPerformance.contributionTypes.support}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Current Streak</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{userPerformance.currentStreak}</div>
                        <p className="text-xs text-muted-foreground">Days in a row</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Time This Week</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{(userPerformance.timeThisWeek / 60).toFixed(2)} hours</div>
                        <p className="text-xs text-muted-foreground">Completed this week</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>Monthly Performance Trends</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={400}>
                        <LineChart data={userPerformance.monthlyData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="attendCount" stroke="#8884d8" name="Attendees" activeDot={{ r: 8 }} />
                            <Line type="monotone" dataKey="ownCount" stroke="#82ca9d" name="Owners" activeDot={{ r: 8 }} />
                            <Line type="monotone" dataKey="supportCount" stroke="#ffc658" name="Supporters" activeDot={{ r: 8 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Contribution Types</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={[userPerformance.contributionTypes]}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="attend" fill="#8884d8" />
                            <Bar dataKey="support" fill="#82ca9d" />
                            <Bar dataKey="own" fill="#ffc658" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
}