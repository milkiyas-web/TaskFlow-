import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Assuming you're using axios for API calls
import Header from './Header';

const TasksHeader = ({ projectId }) => {
    const [projectTitle, setProjectTitle] = useState('');


    useEffect(() => {
        const fetchProjectData = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/projects/${projectId}`);
                const projectData = response.data;
                console.log(projectData)
                setProjectTitle(projectData.name);

            } catch (error) {
                console.error('Error fetching project data:', error);
            }
        };

        if (projectId) {
            fetchProjectData();
        }
    }, [projectId]);

    return (
        <div className='px-4 xl:px-6'>
            <div className='pb-2 pt-2 lg:pb-1 lg:pt-3'>
                <Header name={projectTitle || "Loading..."} />
            </div>

            <div className='flex flex-wrap-reverse gap-1 border-y border-gray-500 dark:border-stroke-dark md:items-center'></div>
        </div>
    );
};

export default TasksHeader;
