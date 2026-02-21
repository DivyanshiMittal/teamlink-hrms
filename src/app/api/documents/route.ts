import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Document from '@/models/Document';

// GET all documents for a specific employee
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const employeeId = searchParams.get('employeeId');

        if (!employeeId) {
            return NextResponse.json({ error: 'Employee ID is required.' }, { status: 400 });
        }

        await connectToDatabase();

        const documents = await Document.find({ employeeId }).sort({ createdAt: -1 });

        return NextResponse.json(documents, { status: 200 });

    } catch (error) {
        console.error('Fetch Documents Error:', error);
        return NextResponse.json({ error: 'Failed to fetch documents.' }, { status: 500 });
    }
}
