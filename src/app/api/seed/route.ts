import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Department from '@/models/Department';
import Designation from '@/models/Designation';
import Employee from '@/models/Employee';

export async function GET() {
    try {
        await connectToDatabase();

        // Clear existing data
        await Department.deleteMany({});
        await Designation.deleteMany({});
        await Employee.deleteMany({});

        // Create Departments
        const itDept = await Department.create({
            name: 'IT',
            code: 'DEPT-IT',
            status: 'Active',
        });

        const hrDept = await Department.create({
            name: 'HR',
            code: 'DEPT-HR',
            status: 'Active',
        });

        const financeDept = await Department.create({
            name: 'Finance',
            code: 'DEPT-FIN',
            status: 'Active',
        });

        // Create Designations
        await Designation.insertMany([
            // IT Designations
            {
                name: 'Software Engineer',
                department: itDept._id,
                level: 'L1',
                status: 'Active',
            },
            {
                name: 'Senior Developer',
                department: itDept._id,
                level: 'L2',
                status: 'Active',
            },
            {
                name: 'Team Lead',
                department: itDept._id,
                level: 'L3',
                status: 'Active',
            },
            {
                name: 'Engineering Manager',
                department: itDept._id,
                level: 'L4',
                status: 'Active',
            },

            // HR Designations
            {
                name: 'HR Executive',
                department: hrDept._id,
                level: 'L1',
                status: 'Active',
            },
            {
                name: 'Recruiter',
                department: hrDept._id,
                level: 'L2',
                status: 'Active',
            },
            {
                name: 'HR Manager',
                department: hrDept._id,
                level: 'L3',
                status: 'Active',
            },

            // Finance Designations
            {
                name: 'Accountant',
                department: financeDept._id,
                level: 'L1',
                status: 'Active',
            },
            {
                name: 'Finance Manager',
                department: financeDept._id,
                level: 'L3',
                status: 'Active',
            },
        ]);

        return NextResponse.json(
            { message: 'Database seeded successfully with Departments and Designations!' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Seeding error:', error);
        return NextResponse.json(
            { error: 'Failed to seed database' },
            { status: 500 }
        );
    }
}
