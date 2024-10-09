import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        start: {
            type: Date,
            required: true
        },
        end: {
            type: Date,
            required: true
        },
        contributionType: {
            type: String,
            required: true
        },
        userId: {
            type: String,
            required: true
        },
        // For multi-user systems
    }
);

const Event = mongoose.model('Event', eventSchema);
export default Event
