import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ListTodo, Trophy, Flame, Settings, Plus, Play, Menu, Building, Globe, Icon } from 'lucide-react'
import React from 'react'


const organizationRanks = [
    { id: 1, name: "Alice Johnson", points: 9500, avatar: "/placeholder.svg?height=32&width=32" },
    { id: 2, name: "Bob Smith", points: 9200, avatar: "/placeholder.svg?height=32&width=32" },
    { id: 3, name: "Charlie Brown", points: 8800, avatar: "/placeholder.svg?height=32&width=32" },
    { id: 4, name: "Current User", points: 8500, avatar: "/placeholder.svg?height=32&width=32", isCurrent: true },
    { id: 5, name: "David Lee", points: 8200, avatar: "/placeholder.svg?height=32&width=32" },
]

// Mock data for global ranks
const globalRanks = [
    { id: 1, name: "Jane Doe", points: 15000, avatar: "/placeholder.svg?height=32&width=32" },
    { id: 2, name: "John Smith", points: 14500, avatar: "/placeholder.svg?height=32&width=32" },
    { id: 3, name: "Emily Brown", points: 14000, avatar: "/placeholder.svg?height=32&width=32" },
    { id: 4, name: "Current User", points: 8500, avatar: "/placeholder.svg?height=32&width=32", isCurrent: true },
    { id: 5, name: "Michael Wang", points: 8000, avatar: "/placeholder.svg?height=32&width=32" },
]

function LeaderboardComponent({ ranks, title, icon: Icon }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                    <Icon className="text-primary" size={24} />
                    <span>{title}</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <ul className="space-y-4">
                    {ranks.map((user, index) => (
                        <li key={user.id} className={`flex items-center space-x-4 p-2 rounded ${user.isCurrent ? 'bg-primary/10' : ''}`}>
                            <span className="font-bold w-6">{index + 1}</span>
                            <Avatar>
                                <AvatarImage src={user.avatar} alt={user.name} />
                                <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <span className="flex-grow">{user.name}</span>
                            <span className="font-semibold">{user.points} pts</span>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    )
}
const Social = () => {
    return (
        <Tabs defaultValue="organization" className="mb-6">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="organization">Organization</TabsTrigger>
                <TabsTrigger value="global">Global</TabsTrigger>
            </TabsList>
            <TabsContent value="organization">
                <LeaderboardComponent ranks={organizationRanks} title="Organization Leaderboard" icon={Building} />
            </TabsContent>
            <TabsContent value="global">
                <LeaderboardComponent ranks={globalRanks} title="Global Leaderboard" icon={Globe} />
            </TabsContent>
        </Tabs>
    )
}

export default Social