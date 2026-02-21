import mongoose, { Schema, Document } from 'mongoose';

export interface IDesignation extends Document {
    name: string;
    department: mongoose.Types.ObjectId;
    level?: string;
    status: 'Active' | 'Inactive';
    createdAt: Date;
    updatedAt: Date;
}

const DesignationSchema: Schema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        department: {
            type: Schema.Types.ObjectId,
            ref: 'Department',
            required: true,
        },
        level: {
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

const Designation = mongoose.models.Designation || mongoose.model<IDesignation>('Designation', DesignationSchema);

export default Designation;
