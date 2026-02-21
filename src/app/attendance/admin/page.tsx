'use client';

import { useState, useEffect } from 'react';

interface AttendanceRecord {
    _id: string;
    employeeId: string;
    date: string;
    checkInTime?: string;
    checkOutTime?: string;
    totalWorkingHours?: number;
    status: string;
}

export default function AdminAttendancePage() {
    const [records, setRecords] = useState<AttendanceRecord[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTodayAttendance();
    }, []);

    const fetchTodayAttendance = async () => {
        setLoading(true);
        try {
            // Calling API without employeeId defaults to all records for today
            const res = await fetch('/api/attendance');
            if (res.ok) {
                const data = await res.json();
                setRecords(data);
            }
        } catch (error) {
            console.error('Failed to fetch admin attendance', error);
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (isoString?: string) => {
        if (!isoString) return '--:--';
        return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="min-h-screen bg-slate-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Admin Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-800">Attendance Overview</h1>
                        <p className="text-slate-500 mt-1">Daily Log (HR / Admin View)</p>
                    </div>
                    <div className="mt-4 md:mt-0 px-6 py-3 bg-indigo-50 border border-indigo-100 rounded-xl text-right">
                        <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-1">Live Date</p>
                        <p suppressHydrationWarning className="text-lg font-bold text-indigo-700">{new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</p>
                    </div>
                </div>

                {/* Live Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 border-l-4 border-l-blue-500">
                        <p className="text-sm font-medium text-slate-500">Total Records Today</p>
                        <p className="text-3xl font-black text-slate-800 mt-2">{records.length}</p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 border-l-4 border-l-emerald-500">
                        <p className="text-sm font-medium text-slate-500">Present / Checked In</p>
                        <p className="text-3xl font-black text-emerald-600 mt-2">
                            {records.filter(r => r.status === 'Present' || !!r.checkInTime).length}
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 border-l-4 border-l-amber-500">
                        <p className="text-sm font-medium text-slate-500">Late Arrivals</p>
                        <p className="text-3xl font-black text-amber-500 mt-2">
                            {records.filter(r => r.status === 'Late').length}
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 border-l-4 border-l-rose-500">
                        <p className="text-sm font-medium text-slate-500">Absent / Not Clocked</p>
                        <p className="text-3xl font-black text-rose-500 mt-2">
                            --
                        </p>
                        <p className="text-xs text-slate-400 mt-1">Requires full roster sync</p>
                    </div>
                </div>

                {/* Employee Roster Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100">
                        <h3 className="text-lg font-bold text-slate-800">Today&apos;s Check-ins</h3>
                        <button onClick={fetchTodayAttendance} className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">
                            ↻ Refresh Feed
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 text-slate-500 text-xs font-bold border-b border-slate-200 uppercase tracking-wider">
                                    <th className="py-4 px-6">Employee ID</th>
                                    <th className="py-4 px-6">Clock In</th>
                                    <th className="py-4 px-6">Clock Out</th>
                                    <th className="py-4 px-6">Total Hours</th>
                                    <th className="py-4 px-6 text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-slate-700">
                                {loading ? (
                                    <tr><td colSpan={5} className="py-12 text-center text-slate-400 font-medium">Loading organization roster...</td></tr>
                                ) : records.length === 0 ? (
                                    <tr><td colSpan={5} className="py-12 text-center text-slate-400 font-medium">No check-ins recorded today.</td></tr>
                                ) : (
                                    records.map((rec) => (
                                        <tr key={rec._id} className="hover:bg-slate-50 transition-colors">
                                            <td className="py-4 px-6 font-bold text-slate-900">{rec.employeeId}</td>
                                            <td className="py-4 px-6 text-slate-600">{formatTime(rec.checkInTime)}</td>
                                            <td className="py-4 px-6 text-slate-600">{formatTime(rec.checkOutTime)}</td>
                                            <td className="py-4 px-6 font-semibold text-slate-800">{rec.totalWorkingHours?.toFixed(2) || 'Active'}</td>
                                            <td className="py-4 px-6 text-right">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border
                          ${rec.status === 'Present' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : ''}
                          ${rec.status === 'Late' ? 'bg-amber-50 text-amber-700 border-amber-200' : ''}
                          ${rec.status === 'Half Day' ? 'bg-orange-50 text-orange-700 border-orange-200' : ''}
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
