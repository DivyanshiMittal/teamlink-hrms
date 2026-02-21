import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Department from '@/models/Department';

export async function GET() {
    try {
        await connectToDatabase();

        const departments = await Department.find({ status: 'Active' })
            .select('_id name code')
            .sort({ name: 1 });

        return NextResponse.json(departments);
    } catch (error) {
        console.error('Failed to fetch departments:', error);
        return NextResponse.json({ error: 'Failed to fetch departments' }, { status: 500 });
    }
}
