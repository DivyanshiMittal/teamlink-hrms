import { NextRequest, NextResponse } from 'next/server';
import { readFile, unlink } from 'fs/promises';
import { join } from 'path';
import connectToDatabase from '@/lib/mongodb';
import Document from '@/models/Document';

// Retrieve secure file
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function GET(request: NextRequest, { params }: any) {
    try {
        const id = params.id;

        await connectToDatabase();
        const docRecord = await Document.findById(id);

        if (!docRecord) {
            return NextResponse.json({ error: 'Document not found' }, { status: 404 });
        }

        const filePath = join(process.cwd(), 'private_uploads', docRecord.storedFileName);

        // Read the securely stored file
        const fileBuffer = await readFile(filePath);

        // Return the response as a file stream with appropriate headers
        return new NextResponse(fileBuffer, {
            status: 200,
            headers: {
                'Content-Type': docRecord.mimeType,
                'Content-Disposition': `inline; filename="${docRecord.fileName}"`,
            }
        });

    } catch (error) {
        console.error('Secure File Retrieval Error:', error);
        return NextResponse.json({ error: 'File retrieval failed or file is missing.' }, { status: 500 });
    }
}

// Delete Document
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function DELETE(request: NextRequest, { params }: any) {
    try {
        const id = params.id;

        await connectToDatabase();
        const docRecord = await Document.findById(id);

        if (!docRecord) {
            return NextResponse.json({ error: 'Document not found' }, { status: 404 });
        }

        // Delete DB record
        await Document.findByIdAndDelete(id);

        // Delete physical file
        const filePath = join(process.cwd(), 'private_uploads', docRecord.storedFileName);
        try {
            await unlink(filePath);
        } catch {
            // Ignored if file doesn't exist on disk
        }

        return NextResponse.json({ message: 'Document deleted successfully' }, { status: 200 });

    } catch (error) {
        console.error('Delete Document Error:', error);
        return NextResponse.json({ error: 'Failed to delete Document.' }, { status: 500 });
    }
}
