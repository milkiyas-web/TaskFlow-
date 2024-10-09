import { create } from "zustand";
import axios from "../lib/axios";
import toast from "react-hot-toast"



export const useTaskStore = create((set) => ({
    tasks: [],
    loading: false,
    error: null,
    setTasks: (updatedTasks) => set({ tasks: updatedTasks }),
    getTasks: async (projectId) => {
        set({ isLoading: true });
        try {
            const response = await axios.get(`http://localhost:5000/api/projects/${projectId}/tasks`);
            console.log("API response: ", response.data)
            set({ tasks: response.data, isLoading: false });
            // console.log(tasks)
        } catch (error) {
            console.error("Error fetching tasks: ", error.message);
            set({ error: error.message, isLoading: false })
        }
    },
    updateTaskStatus: (taskId, newStatus) => {
        set(state => ({
            tasks: state.tasks.map(task =>
                task._id === taskId ? { ...task, status: newStatus } : task
            )
        }));
    },
    moveTask: (taskId, newStatus) => {
        set((state) => ({
            tasks: state.tasks.map((task) =>
                task._id === taskId ? { ...task, status: newStatus } : task
            )
        }));
    },
    addTask: async (projectId, taskData) => {
        set({ isLoading: true });
        try {
            const response = await axios.post(`http://localhost:5000/api/projects/${projectId}/tasks`, taskData);
            set((state) => ({
                tasks: [...state.tasks, response.data],
                isLoading: false,
            }));
        } catch (error) {
            set({ error: error.message, isLoading: false });
        }
    }
})
)
