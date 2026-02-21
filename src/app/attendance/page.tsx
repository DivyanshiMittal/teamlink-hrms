'use client';

import { useState, useEffect } from 'react';

// Hardcoded for demo since Auth is not fully wired up to session context
const MOCK_CURRENT_USER = 'EMP-DEMO';

interface AttendanceRecord {
    _id: string;
    date: string;
    checkInTime?: string;
    checkOutTime?: string;
    totalWorkingHours?: number;
    status: string;
}

export default function EmployeeAttendancePage() {
    const [records, setRecords] = useState<AttendanceRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    // Today's state
    const [todayRecord, setTodayRecord] = useState<AttendanceRecord | null>(null);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/attendance?employeeId=${MOCK_CURRENT_USER}`);
            if (res.ok) {
                const data = await res.json();
                setRecords(data);

                // Find today's record (normalized date check)
                const todayStr = new Date().toISOString().split('T')[0];
                const recordToday = data.find((r: AttendanceRecord) => r.date.startsWith(todayStr));
                setTodayRecord(recordToday || null);
            }
        } catch (error) {
            console.error('Failed to fetch attendance history', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (action: 'check-in' | 'check-out') => {
        setActionLoading(true);
        try {
            const res = await fetch('/api/attendance', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ employeeId: MOCK_CURRENT_USER, action })
            });

            const data = await res.json();
            if (!res.ok) {
                alert(data.error || 'Action failed');
            } else {
                await fetchHistory();
            }
        } catch (error) {
            console.error('Action error', error);
        } finally {
            setActionLoading(false);
        }
    };

    const formatTime = (isoString?: string) => {
        if (!isoString) return '--:--';
        return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const hasCheckedIn = !!todayRecord?.checkInTime;
    const hasCheckedOut = !!todayRecord?.checkOutTime;

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-800">My Attendance</h1>
                        <p className="text-slate-500 mt-1">Hello, Employee {MOCK_CURRENT_USER}</p>
                    </div>
                    <div className="mt-4 md:mt-0 text-right">
                        <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Today&apos;s Date</p>
                        <p suppressHydrationWarning className="text-xl font-bold text-slate-800">{new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                </div>

                {/* Action Panel */}
                <div className="bg-white rounded-2xl shadow-xl shadow-indigo-100/50 overflow-hidden border border-indigo-50">
                    <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-8 py-6">
                        <h2 className="text-2xl font-bold text-white tracking-wide">Daily Clock In</h2>
                    </div>

                    <div className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">

                            {/* Status Summary */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-100">
                                    <span className="text-slate-600 font-medium">Check In Time:</span>
                                    <span className="font-bold text-slate-800 text-lg">{formatTime(todayRecord?.checkInTime)}</span>
                                </div>
                                <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-100">
                                    <span className="text-slate-600 font-medium">Check Out Time:</span>
                                    <span className="font-bold text-slate-800 text-lg">{formatTime(todayRecord?.checkOutTime)}</span>
                                </div>
                                <div className="flex justify-between items-center bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                                    <span className="text-indigo-800 font-bold">Total Hours Today:</span>
                                    <span className="font-black text-indigo-700 text-xl">{todayRecord?.totalWorkingHours?.toFixed(2) || '0.00'}</span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col gap-4">
                                <button
                                    onClick={() => handleAction('check-in')}
                                    disabled={hasCheckedIn || actionLoading}
                                    className="w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all duration-200 
                    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transform hover:-translate-y-1 active:translate-y-0
                    bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-200"
                                >
                                    {hasCheckedIn ? '✓ Checked In' : '👉 Clock In'}
                                </button>

                                <button
                                    onClick={() => handleAction('check-out')}
                                    disabled={!hasCheckedIn || hasCheckedOut || actionLoading}
                                    className="w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all duration-200 
                    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transform hover:-translate-y-1 active:translate-y-0
                    bg-rose-500 hover:bg-rose-600 text-white shadow-rose-200"
                                >
                                    {hasCheckedOut ? '✓ Checked Out' : '👋 Clock Out'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* History Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
                        <h3 className="text-lg font-bold text-slate-800">Recent Attendance History</h3>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white text-slate-500 text-sm border-b border-slate-200">
                                    <th className="py-4 px-6 font-semibold uppercase tracking-wider">Date</th>
                                    <th className="py-4 px-6 font-semibold uppercase tracking-wider">Clock In</th>
                                    <th className="py-4 px-6 font-semibold uppercase tracking-wider">Clock Out</th>
                                    <th className="py-4 px-6 font-semibold uppercase tracking-wider">Hours</th>
                                    <th className="py-4 px-6 font-semibold uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-slate-700">
                                {loading ? (
                                    <tr><td colSpan={5} className="py-8 text-center text-slate-400">Loading history...</td></tr>
                                ) : records.length === 0 ? (
                                    <tr><td colSpan={5} className="py-8 text-center text-slate-400">No attendance records found.</td></tr>
                                ) : (
                                    records.map((rec) => (
                                        <tr key={rec._id} className="hover:bg-slate-50 transition-colors">
                                            <td className="py-3 px-6 font-medium">{new Date(rec.date).toLocaleDateString()}</td>
                                            <td className="py-3 px-6">{formatTime(rec.checkInTime)}</td>
                                            <td className="py-3 px-6">{formatTime(rec.checkOutTime)}</td>
                                            <td className="py-3 px-6 font-semibold text-slate-600">{rec.totalWorkingHours?.toFixed(2) || '-'}</td>
                                            <td className="py-3 px-6">
                                                <span className={`px-3 py-1 text-xs font-bold rounded-full
                          ${rec.status === 'Present' ? 'bg-emerald-100 text-emerald-700' : ''}
                          ${rec.status === 'Absent' ? 'bg-rose-100 text-rose-700' : ''}
                          ${rec.status === 'Late' ? 'bg-amber-100 text-amber-700' : ''}
                          ${rec.status === 'Half Day' ? 'bg-orange-100 text-orange-700' : ''}
                          ${rec.status === 'Leave' ? 'bg-blue-100 text-blue-700' : ''}
                        `}>
                                                    {rec.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
}
