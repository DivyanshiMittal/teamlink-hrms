import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Attendance from '@/models/Attendance';

// Helper to normalize dates to midnight UTC
const getMidnightUTC = (date: Date = new Date()) => {
    const d = new Date(date);
    d.setUTCHours(0, 0, 0, 0);
    return d;
};

// GET: Fetch attendance
// If `employeeId` query provided -> return that employee's history.
// If not -> return today's attendance for all (Admin view).
export async function GET(request: NextRequest) {
    try {
        await connectToDatabase();

        const { searchParams } = new URL(request.url);
        const employeeId = searchParams.get('employeeId');

        if (employeeId) {
            // Employee Dashboard Data
            const records = await Attendance.find({ employeeId }).sort({ date: -1 });
            return NextResponse.json(records);
        } else {
            // Admin Dashboard Data (Today's records)
            const today = getMidnightUTC();
            const records = await Attendance.find({ date: today }).sort({ createdAt: -1 });
            return NextResponse.json(records);
        }
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// POST: Check In / Check Out
export async function POST(request: NextRequest) {
    try {
        const { employeeId, action } = await request.json();

        if (!employeeId || !action) {
            return NextResponse.json({ error: 'Missing employeeId or action (check-in/check-out).' }, { status: 400 });
        }

        await connectToDatabase();

        const today = getMidnightUTC();
        const now = new Date();

        // Check if a record already exists for today
        let record = await Attendance.findOne({ employeeId, date: today });

        if (action === 'check-in') {
            if (record?.checkInTime) {
                return NextResponse.json({ error: 'Already checked in today.' }, { status: 400 });
            }

            // Determine 'Late' status simplisticly (e.g. after 10 AM local)
            const isLate = now.getHours() >= 10;

            if (!record) {
                record = await Attendance.create({
                    employeeId,
                    date: today,
                    checkInTime: now,
                    status: isLate ? 'Late' : 'Present',
                });
            } else {
                record.checkInTime = now;
                record.status = isLate ? 'Late' : 'Present';
                await record.save();
            }

            return NextResponse.json({ message: 'Checked in successfully!', record });

        } else if (action === 'check-out') {
            if (!record || !record.checkInTime) {
                return NextResponse.json({ error: 'Cannot check out without checking in first.' }, { status: 400 });
            }

            if (record.checkOutTime) {
                return NextResponse.json({ error: 'Already checked out today.' }, { status: 400 });
            }

            record.checkOutTime = now;

            // Calculate working hours
            const diffInMs = now.getTime() - record.checkInTime.getTime();
            const diffInHours = diffInMs / (1000 * 60 * 60);

            record.totalWorkingHours = parseFloat(diffInHours.toFixed(2));

            // Simplistic Half-Day check (less than 4 hours)
            if (record.totalWorkingHours < 4) {
                record.status = 'Half Day';
            }

            await record.save();

            return NextResponse.json({ message: 'Checked out successfully!', record });
        }

        return NextResponse.json({ error: 'Invalid action.' }, { status: 400 });

    } catch (error) {
        console.error('Attendance POST Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
