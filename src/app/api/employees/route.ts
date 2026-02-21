import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Employee from '@/models/Employee';
import Department from '@/models/Department';
import Designation from '@/models/Designation';

// GET: Fetch all employees
export async function GET() {
    try {
        await connectToDatabase();

        // Ensure models are registered cleanly before populating
        // This prevents "Schema hasn't been registered for model" errors in dev
        const deptCheck = Department;
        const desigCheck = Designation;

        const employees = await Employee.find({})
            .populate('department', 'name')
            .populate('designation', 'name')
            .sort({ createdAt: -1 });

        return NextResponse.json(employees);
    } catch (error) {
        console.error('Employees GET Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
