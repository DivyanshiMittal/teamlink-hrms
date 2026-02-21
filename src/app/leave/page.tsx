'use client';

import { useState, useEffect } from 'react';

// Hardcoded for demo
const MOCK_CURRENT_USER = 'EMP-DEMO';

interface LeaveRecord {
    _id: string;
    leaveType: string;
    startDate: string;
    endDate: string;
    reason: string;
    status: string;
    rejectionReason?: string;
    createdAt: string;
}

export default function EmployeeLeaveDashboard() {
    const [history, setHistory] = useState<LeaveRecord[]>([]);
    const [loadingHistory, setLoadingHistory] = useState(true);

    // Form State
    const [leaveType, setLeaveType] = useState('Casual');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [reason, setReason] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        setLoadingHistory(true);
        try {
            const res = await fetch(`/api/leave?employeeId=${MOCK_CURRENT_USER}`);
            if (res.ok) {
                const data = await res.json();
                setHistory(data);
            }
        } catch (error) {
            console.error('Failed to fetch leave history', error);
        } finally {
            setLoadingHistory(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const res = await fetch('/api/leave', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'create',
                    employeeId: MOCK_CURRENT_USER,
                    leaveType,
                    startDate,
                    endDate,
                    reason
                })
            });

            const data = await res.json();
            if (!res.ok) {
                alert(data.error || 'Failed to submit request');
            } else {
                alert('Leave request submitted successfully!');
                // Reset form
                setLeaveType('Casual');
                setStartDate('');
                setEndDate('');
                setReason('');
                // Refresh History
                fetchHistory();
            }
        } catch (error) {
            console.error('Submit error:', error);
            alert('An error occurred while submitting.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-800">Leave Application</h1>
                        <p className="text-slate-500 mt-1">Hello, Employee {MOCK_CURRENT_USER}</p>
                    </div>
                    <div className="mt-4 md:mt-0 px-6 py-3 bg-indigo-50 border border-indigo-100 rounded-xl">
                        <p className="text-sm font-semibold text-indigo-700">Available Balance: <strong>14 Days</strong></p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Form Column */}
                    <div className="lg:col-span-1">
                        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                            <div className="bg-slate-50 border-b border-slate-100 px-6 py-4">
                                <h2 className="text-lg font-bold text-slate-800">New Request</h2>
                            </div>
                            <div className="p-6 space-y-5">

                                <div className="flex flex-col">
                                    <label className="text-sm font-semibold text-slate-700 mb-1.5 text-left">Leave Type</label>
                                    <select required value={leaveType} onChange={(e) => setLeaveType(e.target.value)} className="px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none">
                                        <option value="Casual">Casual Leave</option>
                                        <option value="Sick">Sick Leave</option>
                                        <option value="Paid">Paid Time Off (PTO)</option>
                                    </select>
                                </div>

                                <div className="flex flex-col">
                                    <label className="text-sm font-semibold text-slate-700 mb-1.5 text-left">Start Date</label>
                                    <input required type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
                                </div>

                                <div className="flex flex-col">
                                    <label className="text-sm font-semibold text-slate-700 mb-1.5 text-left">End Date</label>
                                    <input required type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
                                </div>

                                <div className="flex flex-col">
                                    <label className="text-sm font-semibold text-slate-700 mb-1.5 text-left">Reason</label>
                                    <textarea required value={reason} onChange={(e) => setReason(e.target.value)} rows={3} placeholder="Please provide details..." className="px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none"></textarea>
                                </div>

                                <button disabled={submitting} type="submit" className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-md transition-all disabled:opacity-50">
                                    {submitting ? 'Submitting...' : 'Submit Request'}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* History Column */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden h-full flex flex-col">
                            <div className="bg-slate-50 border-b border-slate-100 px-6 py-4 flex justify-between items-center">
                                <h2 className="text-lg font-bold text-slate-800">My Applications History</h2>
                                <span className="text-xs bg-slate-200 text-slate-600 px-2 py-1 rounded font-bold">{history.length} Total</span>
                            </div>

                            <div className="flex-1 overflow-x-auto p-0">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-white border-b border-slate-100 text-slate-400 text-xs uppercase tracking-wider">
                                            <th className="py-4 px-6 font-semibold">Details</th>
                                            <th className="py-4 px-6 font-semibold">Duration</th>
                                            <th className="py-4 px-6 font-semibold text-right">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {loadingHistory ? (
                                            <tr><td colSpan={3} className="py-12 text-center text-slate-400">Loading records...</td></tr>
                                        ) : history.length === 0 ? (
                                            <tr><td colSpan={3} className="py-12 text-center text-slate-400">No past leave applications.</td></tr>
                                        ) : (
                                            history.map((record) => (
                                                <tr key={record._id} className="hover:bg-slate-50 transition-colors">
                                                    <td className="py-4 px-6">
                                                        <p className="font-bold text-slate-800">{record.leaveType} Leave</p>
                                                        <p className="text-sm text-slate-500 mt-1 max-w-xs truncate" title={record.reason}>&quot;{record.reason}&quot;</p>
                                                        {record.rejectionReason && (
                                                            <div className="mt-2 text-xs bg-rose-50 text-rose-700 p-2 rounded border border-rose-100">
                                                                <strong>Admin Note:</strong> {record.rejectionReason}
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="py-4 px-6 text-sm text-slate-600 whitespace-nowrap">
                                                        {new Date(record.startDate).toLocaleDateString()} <br />
                                                        <span className="text-slate-400">to</span> <br />
                                                        {new Date(record.endDate).toLocaleDateString()}
                                                    </td>
                                                    <td className="py-4 px-6 text-right whitespace-nowrap">
                                                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold
                                                ${record.status === 'Pending' ? 'bg-amber-100 text-amber-700' : ''}
                                                ${record.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : ''}
                                                ${record.status === 'Rejected' ? 'bg-rose-100 text-rose-700' : ''}
                                            `}>
                                                            {record.status === 'Pending' ? '⏳ Pending' : record.status}
                                                        </span>
                                                        <p className="text-xs text-slate-400 mt-2">Applied: {new Date(record.createdAt).toLocaleDateString()}</p>
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
            </div>
        </div>
    );
}
