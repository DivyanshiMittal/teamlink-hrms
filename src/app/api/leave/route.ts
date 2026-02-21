import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Leave from '@/models/Leave';

// GET: Fetch Leave Requests
// If employeeId is passed -> returns history for that employee
// If omitted -> returns all Pending requests (for admin)
export async function GET(request: NextRequest) {
    try {
        await connectToDatabase();

        const { searchParams } = new URL(request.url);
        const employeeId = searchParams.get('employeeId');

        if (employeeId) {
            // Return employee history
            const leaves = await Leave.find({ employeeId }).sort({ createdAt: -1 });
            return NextResponse.json(leaves);
        } else {
            // Return Admin Pending Queue
            const pendingLeaves = await Leave.find({ status: 'Pending' }).sort({ createdAt: 1 });
            return NextResponse.json(pendingLeaves);
        }
    } catch (error) {
        console.error('Leave GET Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// POST: Create new Leave | Update Leave Status
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { action, employeeId, leaveType, startDate, endDate, reason, leaveId, status, rejectionReason } = body;

        await connectToDatabase();

        // Route: Create New Request (Employee)
        if (action === 'create') {
            if (!employeeId || !leaveType || !startDate || !endDate || !reason) {
                return NextResponse.json({ error: 'Missing required leave request fields' }, { status: 400 });
            }

            if (new Date(startDate) > new Date(endDate)) {
                return NextResponse.json({ error: 'End Date cannot be before Start Date' }, { status: 400 });
            }

            const newLeave = await Leave.create({
                employeeId,
                leaveType,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                reason,
                status: 'Pending',
            });

            return NextResponse.json({ message: 'Leave request submitted', request: newLeave }, { status: 201 });
        }

        // Route: Update Existing Request (Admin)
        if (action === 'update_status') {
            if (!leaveId || !status) {
                return NextResponse.json({ error: 'Leave ID and Status are required' }, { status: 400 });
            }

            const leaveToUpdate = await Leave.findById(leaveId);
            if (!leaveToUpdate) {
                return NextResponse.json({ error: 'Leave request not found' }, { status: 404 });
            }

            if (status === 'Rejected' && (!rejectionReason || rejectionReason.trim() === '')) {
                return NextResponse.json({ error: 'A rejection reason is strictly required' }, { status: 400 });
            }

            leaveToUpdate.status = status;
            if (status === 'Rejected') {
                leaveToUpdate.rejectionReason = rejectionReason;
            }

            await leaveToUpdate.save();

            return NextResponse.json({ message: `Leave ${status} successfully`, request: leaveToUpdate });
        }

        return NextResponse.json({ error: 'Invalid action specified' }, { status: 400 });

    } catch (error) {
        console.error('Leave POST Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
