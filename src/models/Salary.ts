import mongoose, { Schema, Document } from 'mongoose';

export interface ISalary extends Document {
    employeeId: string;
    targetMonth: string;
    targetYear: string;
    basicSalary: number;
    hra: number;
    specialAllowance: number;
    pf: number;
    professionalTax: number;
    netSalary: number;
    status: 'Generated' | 'Paid';
    createdAt: Date;
    updatedAt: Date;
}

const SalarySchema: Schema = new Schema(
    {
        employeeId: {
            type: String,
            required: true,
            index: true,
        },
        targetMonth: {
            type: String, // e.g., '01', '02', '11'
            required: true,
        },
        targetYear: {
            type: String, // e.g., '2026'
            required: true,
        },
        basicSalary: {
            type: Number,
            required: true,
        },
        hra: {
            type: Number,
            required: true,
        },
        specialAllowance: {
            type: Number,
            required: true,
            default: 0,
        },
        pf: {
            type: Number,
            required: true,
        },
        professionalTax: {
            type: Number,
            required: true,
        },
        netSalary: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ['Generated', 'Paid'],
            default: 'Generated',
            index: true,
        },
    },
    {
        timestamps: true,
    }
);

// Prevent duplicate payslips for the same employee in the same month/year
SalarySchema.index({ employeeId: 1, targetMonth: 1, targetYear: 1 }, { unique: true });

const Salary = mongoose.models.Salary || mongoose.model<ISalary>('Salary', SalarySchema);

export default Salary;
