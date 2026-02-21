import mongoose, { Schema, Document } from 'mongoose';

export interface IAttendance extends Document {
    employeeId: string;
    date: Date;
    checkInTime?: Date;
    checkOutTime?: Date;
    totalWorkingHours?: number;
    status: 'Present' | 'Absent' | 'Late' | 'Half Day' | 'Leave';
    createdAt: Date;
    updatedAt: Date;
}

const AttendanceSchema: Schema = new Schema(
    {
        employeeId: {
            type: String,
            required: true,
            index: true,
        },
        date: {
            type: Date,
            required: true,
            index: true,
        },
        checkInTime: {
            type: Date,
        },
        checkOutTime: {
            type: Date,
        },
        totalWorkingHours: {
            type: Number,
            default: 0,
        },
        status: {
            type: String,
            enum: ['Present', 'Absent', 'Late', 'Half Day', 'Leave'],
            default: 'Present',
        },
    },
    {
        timestamps: true,
    }
);

// Compound index to ensure one record per employee per day
AttendanceSchema.index({ employeeId: 1, date: 1 }, { unique: true });

const Attendance = mongoose.models.Attendance || mongoose.model<IAttendance>('Attendance', AttendanceSchema);

export default Attendance;
