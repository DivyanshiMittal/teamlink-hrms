import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import connectToDatabase from '@/lib/mongodb';
import Document from '@/models/Document';

// Allowed mime types
const ALLOWED_MIME_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();

        const file = formData.get('file') as File | null;
        const employeeId = formData.get('employeeId') as string | null;
        const documentType = formData.get('documentType') as string | null;

        if (!file || !employeeId || !documentType) {
            return NextResponse.json(
                { error: 'Missing required fields (file, employeeId, documentType).' },
                { status: 400 }
            );
        }

        if (!ALLOWED_MIME_TYPES.includes(file.type)) {
            return NextResponse.json(
                { error: 'Invalid file type. Only PDF, JPG, and PNG are allowed.' },
                { status: 400 }
            );
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Generate secure randomized filename
        const fileExtension = file.name.split('.').pop() || 'tmp';
        const storedFileName = `${uuidv4()}.${fileExtension}`;

        // Path outside public folder
        const uploadDir = join(process.cwd(), 'private_uploads');

        // Ensure directory exists
        try {
            await mkdir(uploadDir, { recursive: true });
        } catch {
            // Ignored if directory exists
        }

        const filePath = join(uploadDir, storedFileName);

        // Write file to disk securely
        await writeFile(filePath, buffer);

        // Store metadata in DB
        await connectToDatabase();

        const docRecord = await Document.create({
            employeeId,
            fileName: file.name,
            storedFileName,
            mimeType: file.type,
            documentType,
            uploadedBy: 'Current User' // Placeholder for actual session user
        });

        return NextResponse.json(
            { message: 'File uploaded securely.', document: docRecord },
            { status: 201 }
        );

    } catch (error) {
        console.error('Upload Error:', error);
        return NextResponse.json({ error: 'Failed to process file upload.' }, { status: 500 });
    }
}
