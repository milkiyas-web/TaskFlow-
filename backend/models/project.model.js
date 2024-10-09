import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        deadline: {
            type: Date,
            required: true,
        },
        tag: {
            type: String,
            required: true,
        },
        user: {
            type: [String],
            required: true,
        },
        organizationId: { // Add this field
            type: String,
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

const Project = mongoose.model("Project", projectSchema);

export default Project;