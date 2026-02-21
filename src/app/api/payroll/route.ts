import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Salary from '@/models/Salary';
import Employee from '@/models/Employee';

// Generate random salary components for demo purposes
// In a real app, these would be pulled from a fixed Job/Position schema
const generateMockSalaryDetails = () => {
    const basic = 40000 + Math.floor(Math.random() * 20000);
    const hra = basic * 0.4;
    const special = 5000 + Math.floor(Math.random() * 10000);
    const pf = basic * 0.12;
    const tax = 200;

    return {
        basicSalary: Math.round(basic),
        hra: Math.round(hra),
        specialAllowance: Math.round(special),
        pf: Math.round(pf),
        professionalTax: Math.round(tax),
        netSalary: Math.round((basic + hra + special) - (pf + tax))
    };
};

// GET: Retrieve payslips
export async function GET(request: NextRequest) {
    try {
        await connectToDatabase();

        const { searchParams } = new URL(request.url);
        const employeeId = searchParams.get('employeeId');
        const month = searchParams.get('month');
        const year = searchParams.get('year');

        const query: Record<string, string> = {};

        if (employeeId) query.employeeId = employeeId;
        if (month) query.targetMonth = month;
        if (year) query.targetYear = year;

        // Fetch sorting by newest period first
        const records = await Salary.find(query).sort({ targetYear: -1, targetMonth: -1 });

        return NextResponse.json(records);

    } catch (error) {
        console.error('Payroll GET Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// POST: Generate Monthly Payroll
export async function POST(request: NextRequest) {
    try {
        const { targetMonth, targetYear } = await request.json();

        if (!targetMonth || !targetYear) {
            return NextResponse.json({ error: 'targetMonth and targetYear are required' }, { status: 400 });
        }

        await connectToDatabase();

        // 1. Fetch all active employees (in demo, all employees)
        const employees = await Employee.find({});
        if (employees.length === 0) {
            return NextResponse.json({ error: 'No active employees found to generate payroll for.' }, { status: 404 });
        }

        let generatedCount = 0;
        let skippedCount = 0;

        // 2. Iterate and generate a payslip for each
        for (const emp of employees) {
            // Check if already generated for this exact period
            const existing = await Salary.findOne({
                employeeId: emp.employeeId,
                targetMonth,
                targetYear
            });

            if (existing) {
                skippedCount++;
                continue;
            }

            const mockSalary = generateMockSalaryDetails();

            await Salary.create({
                employeeId: emp.employeeId,
                targetMonth,
                targetYear,
                ...mockSalary,
                status: 'Generated'
            });

            generatedCount++;
        }

        return NextResponse.json({
            message: `Payroll run complete. Generated: ${generatedCount}, Skipped (already generated): ${skippedCount}`,
            generatedCount,
            skippedCount
        }, { status: 201 });

    } catch (error) {
        console.error('Payroll POST Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
