import Task from '../models/project.model.js';


export const createTask = async (req, res) => {
    try {
        const { name, deadline, user } = req.body;

        const task = await Task.create({
            name,
            deadline,
            user,
        });
        res.status(201).json(task)
    } catch (error) {
        console.log("Error in createTask controller", error.message)
        res.status(500).json({ message: "Server error", error: error.message })
    }
}


export const getTasks = async () => {


}