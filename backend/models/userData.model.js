import mongoose from 'mongoose';

const UserDataSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    currentStreak: { type: Number, default: 0 },
    lastUpdated: { type: Date, default: Date.now },
    totalTasksCompleted: { type: Number, default: 0 },
    tasksThisWeek: { type: Number, default: 0 },
    contributionTypes: {
        attend: { type: Number, default: 0 },
        support: { type: Number, default: 0 },
        own: { type: Number, default: 0 }
    },
    monthlyData: [{
        month: String,
        timeboxScore: Number,
        tasksCompleted: Number,
        hours: Number
    }]
});

const UserData = mongoose.model('UserData', UserDataSchema);
export default UserData;
