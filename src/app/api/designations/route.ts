import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Designation from '@/models/Designation';

export async function GET(request: Request) {
    try {
        await connectToDatabase();

        const { searchParams } = new URL(request.url);
        const departmentId = searchParams.get('departmentId');

        // Build query to conditionally filter by department
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const query: any = { status: 'Active' };

        if (departmentId) {
            query.department = departmentId;
        }

        const designations = await Designation.find(query)
            .select('_id name level department')
            .populate('department', 'name')
            .sort({ name: 1 });

        return NextResponse.json(designations);
    } catch (error) {
        console.error('Failed to fetch designations:', error);
        return NextResponse.json(
            { error: 'Failed to fetch designations' },
            { status: 500 }
        );
    }
}
