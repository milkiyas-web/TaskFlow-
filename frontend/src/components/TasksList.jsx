

import React from 'react'
import TasksHeader from './TasksHeader'
import Board from './Board'
import { useParams } from 'react-router-dom'

const TasksList = () => {
    const { projectId } = useParams()
    console.log(projectId)
    return (
        <div>
            <TasksHeader projectId={projectId} />
            <Board projectId={projectId} />
        </div>
    )
}

export default TasksList