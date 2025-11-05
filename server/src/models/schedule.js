
import mongoose from 'mongoose';

export const scheduleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    notes: {
        type: String
    },
    date: {
        type: Date,
        required: true
    },
    startTime: {
        type: String,
        required: true
    },
    endTime: {
        type: String,
        required: true
    },
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    },
    shift: {
        type: String,
        enum: ['morning', 'night'],
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: 'pending'
    }

},
{
    timestamps: true
})

export const Schedule = mongoose.model('Schedule', scheduleSchema);