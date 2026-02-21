import mongoose, { Schema, Document } from 'mongoose';

export interface ILeave extends Document {
    employeeId: string;
    leaveType: 'Casual' | 'Sick' | 'Paid';
    startDate: Date;
    endDate: Date;
    reason: string;
    status: 'Pending' | 'Approved' | 'Rejected';
    rejectionReason?: string;
    createdAt: Date;
    updatedAt: Date;
}

const LeaveSchema: Schema = new Schema(
    {
        employeeId: {
            type: String,
            required: true,
            index: true,
        },
        leaveType: {
            type: String,
            enum: ['Casual', 'Sick', 'Paid'],
            required: true,
        },
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
        },
        reason: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ['Pending', 'Approved', 'Rejected'],
            default: 'Pending',
            index: true,
        },
        rejectionReason: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

const Leave = mongoose.models.Leave || mongoose.model<ILeave>('Leave', LeaveSchema);

export default Leave;
