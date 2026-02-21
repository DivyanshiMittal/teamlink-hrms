import mongoose, { Schema, Document } from 'mongoose';

export interface IEmployee extends Document {
    // Required
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
    gender: string;
    profilePhoto: string;
    employeeId: string;
    department: mongoose.Types.ObjectId;
    designation: mongoose.Types.ObjectId;
    dateOfJoining: Date;

    // Optional
    maritalStatus?: string;
    bloodGroup?: string;
    nationality?: string;
    reportingManager?: mongoose.Types.ObjectId;
    workLocation?: string;
    shift?: string;

    // Contact Details
    email: string;
    personalContactNumber: string;
    alternateContactNumber?: string;
    currentAddress: string;
    permanentAddress: string;

    createdAt: Date;
    updatedAt: Date;
}

const EmployeeSchema: Schema = new Schema(
    {
        firstName: { type: String, required: true, trim: true },
        lastName: { type: String, required: true, trim: true },
        dateOfBirth: { type: Date, required: true },
        gender: { type: String, required: true },
        profilePhoto: { type: String, required: true },
        employeeId: { type: String, required: true, unique: true },
        department: { type: Schema.Types.ObjectId, ref: 'Department', required: true },
        designation: { type: Schema.Types.ObjectId, ref: 'Designation', required: true },
        dateOfJoining: { type: Date, required: true },

        maritalStatus: { type: String },
        bloodGroup: { type: String },
        nationality: { type: String },
        reportingManager: { type: Schema.Types.ObjectId, ref: 'Employee' },
        workLocation: { type: String },
        shift: { type: String },

        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        personalContactNumber: { type: String, required: true },
        alternateContactNumber: { type: String },
        currentAddress: { type: String, required: true },
        permanentAddress: { type: String, required: true },
    },
    {
        timestamps: true,
    }
);

const Employee = mongoose.models.Employee || mongoose.model<IEmployee>('Employee', EmployeeSchema);

export default Employee;
