import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { OrganizationSwitcher, useOrganization, useOrganizationList } from "@clerk/clerk-react"
import { PlusIcon, FilterIcon, LayoutGridIcon, CheckIcon } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function Organization() {
    // const { userMemberships, isLoaded } = useOrganizationList()
    const [members, setMembers] = useState([])
    const { organization, isLoaded } = useOrganization();
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

    // if (!organization) {
    //     return <div>No organization selected</div>;
    // }

    if (error) {
        return <div>Error: {error}</div>;
    }



    const formattedMembers = members.map(member => {

        return {
            value: member.publicUserData?.userId || '',
            label: `${member.publicUserData?.firstName || ''} ${member.publicUserData?.lastName || ''}`.trim() || 'Unknown User'
        };
    });




    // const hasOrganizations = formattedMembers && userMemberships.data.length > 0

    return (
        <div className="min-h-screen dark:bg-black dark:text-gray-300 p-8">
            <div className="max-w-6xl mx-auto">
                <header className="flex justify-between items-center mb-8">
                    <div className="flex items-center space-x-2">
                        <h1 className="text-2xl font-semibold dark:text-white">Organization</h1>
                    </div>
                    <OrganizationSwitcher />
                </header>

                {!organization ? (
                    <div className="text-center py-10">
                        <h2 className="text-xl font-semibold mb-4">No organization selected</h2>
                        <p className="mb-4">Please select or create an organization to view members</p>
                    </div>
                ) : (
                    <>
                        <h2 className="text-xl font-semibold mb-4">Members of {organization.name}</h2>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>User</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Email</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {members.map((member) => (
                                    <TableRow key={member.id}>
                                        <TableCell className="flex items-center space-x-2">
                                            <Avatar>
                                                <AvatarImage src={member.publicUserData?.imageUrl} />
                                                <AvatarFallback>{member.publicUserData?.firstName?.[0]}{member.publicUserData?.lastName?.[0]}</AvatarFallback>
                                            </Avatar>
                                            <span>{member.publicUserData?.firstName} {member.publicUserData?.lastName}</span>
                                        </TableCell>
                                        <TableCell>{member.role}</TableCell>
                                        <TableCell>{member.publicUserData?.emailAddress}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </>
                )}
            </div>
        </div>
    )
}