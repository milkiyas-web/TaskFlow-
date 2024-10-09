
import axios from "axios";

export const createTask = async (taskData) => {
    const res = await axios.post("http://localhost:5000/api/task", taskData);
}