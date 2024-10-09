import mongoose, { trusted } from "mongoose";


const { Schema } = mongoose;

const taskSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['To Do', 'Work In Progress', 'Under Review', 'Completed'],
        default: 'To Do',
    },
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        reg: "Project",
        required: true,
    },
    points: {
        type: Number,
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
    },
    attachments: [
        {
            fileUrl: { type: String },
            fileName: { type: String },
        },
    ],
    tags: [String],
    assignees: [
        {
            userId: { type: String, required: true },
            profilePictureUrl: { type: String },
            username: { type: String },
        },
    ],
    author: {
        userId: { type: String, required: true },
        profilePictureUrl: { type: String },
        username: { type: String },
    },
    contribuitionType: {
        type: String,
        enum: ["Attended", "Support", "Own"],
    },
    durDate: {
        type: Date,
    },

    assignedTo: {
        type: String,
    },
    startDate: {
        type: Date,
    },
    dueDate: {
        type: Date,
    },

});

const Task = mongoose.model("Task", taskSchema);

export default Task