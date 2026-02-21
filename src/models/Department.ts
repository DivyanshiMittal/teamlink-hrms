import mongoose, { Schema, Document } from 'mongoose';

export interface IDepartment extends Document {
    name: string;
    code?: string;
    status: 'Active' | 'Inactive';
    createdAt: Date;
    updatedAt: Date;
}

const DepartmentSchema: Schema = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        code: {
            type: String,
            trim: true,
        },
        status: {
            type: String,
            enum: ['Active', 'Inactive'],
            default: 'Active',
        },
    },
    {
        timestamps: true,
    }
);

// Prevent re-compilation in development
const Department = mongoose.models.Department || mongoose.model<IDepartment>('Department', DepartmentSchema);

export default Department;
