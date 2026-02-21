import mongoose, { Schema, Document as MongooseDocument } from 'mongoose';

export interface IDocument extends MongooseDocument {
    employeeId: string;
    fileName: string;
    storedFileName: string;
    mimeType: string;
    documentType: 'Resume' | 'Government ID' | 'Offer Letter' | 'Other';
    uploadedBy: string;
    createdAt: Date;
    updatedAt: Date;
}

const DocumentSchema: Schema = new Schema(
    {
        employeeId: {
            type: String,
            required: true,
            index: true,
        },
        fileName: {
            type: String,
            required: true,
            trim: true,
        },
        storedFileName: {
            type: String,
            required: true,
            unique: true,
        },
        mimeType: {
            type: String,
            required: true,
        },
        documentType: {
            type: String,
            enum: ['Resume', 'Government ID', 'Offer Letter', 'Other'],
            required: true,
        },
        uploadedBy: {
            type: String,
            required: true,
            default: 'Admin/HR',
        },
    },
    {
        timestamps: true,
    }
);

// Prevent re-compilation in development
const Document = mongoose.models.Document || mongoose.model<IDocument>('Document', DocumentSchema);

export default Document;
