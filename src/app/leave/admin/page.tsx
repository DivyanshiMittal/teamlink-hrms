'use client';

import { useState, useEffect } from 'react';

interface LeaveRequest {
    _id: string;
    employeeId: string;
    leaveType: string;
    startDate: string;
    endDate: string;
    reason: string;
    status: string;
    createdAt: string;
}

export default function AdminLeaveApprovalPage() {
    const [pendingLeaves, setPendingLeaves] = useState<LeaveRequest[]>([]);
    const [loading, setLoading] = useState(true);

    // Modal State
    const [rejectingId, setRejectingId] = useState<string | null>(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const [processingId, setProcessingId] = useState<string | null>(null);

    useEffect(() => {
        fetchPendingLeaves();
    }, []);

    const fetchPendingLeaves = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/leave');
            if (res.ok) {
                const data = await res.json();
                setPendingLeaves(data);
            }
        } catch (error) {
            console.error('Failed to fetch pending requests', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (leaveId: string, status: 'Approved' | 'Rejected', reason?: string) => {
        setProcessingId(leaveId);
        try {
            const res = await fetch('/api/leave', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'update_status',
                    leaveId,
                    status,
                    rejectionReason: reason
                })
            });

            const data = await res.json();
            if (!res.ok) {
                alert(data.error || 'Action failed');
            } else {
                // Remove processed item from list
                setPendingLeaves(prev => prev.filter(req => req._id !== leaveId));
                setRejectingId(null);
                setRejectionReason('');
            }
        } catch (error) {
            console.error('Update error', error);
            alert('An expected error occurred.');
        } finally {
            setProcessingId(null);
        }
    };

    const submitRejection = () => {
        if (!rejectionReason.trim()) {
            alert('A reason is mandatory for rejections.');
            return;
        }
        if (rejectingId) {
            handleAction(rejectingId, 'Rejected', rejectionReason);
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 py-12 px-4 sm:px-6 lg:px-8 relative">

            {/* Rejection Modal Overlay */}
            {rejectingId && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 m-4">
                        <h3 className="text-xl font-bold text-slate-800 mb-2">Reject Leave Request</h3>
                        <p className="text-sm text-slate-500 mb-6">Please provide a mandatory reason explaining why this request cannot be approved.</p>

                        <textarea
                            autoFocus
                            required
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            placeholder="E.g., Insufficient coverage next week..."
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 max-h-40 min-h-24 outline-none mb-6"
                        ></textarea>

                        <div className="flex space-x-4">
                            <button
                                disabled={processingId === rejectingId}
                                onClick={() => { setRejectingId(null); setRejectionReason(''); }}
                                className="flex-1 py-2.5 text-slate-600 font-bold bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                            >Cancel</button>
                            <button
                                disabled={processingId === rejectingId}
                                onClick={submitRejection}
                                className="flex-1 py-2.5 text-white font-bold bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm transition-colors"
                            >{processingId === rejectingId ? 'Processing...' : 'Confirm Rejection'}</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-6xl mx-auto space-y-6">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-800">Leave Approvals Queue</h1>
                        <p className="text-slate-500 mt-1">Review and manage pending time-off requests.</p>
                    </div>
                    <div className="mt-4 md:mt-0 flex items-center space-x-3 bg-amber-50 px-5 py-2.5 rounded-full border border-amber-100">
                        <div className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                        </div>
                        <span className="text-sm font-bold text-amber-700 uppercase tracking-widest">{pendingLeaves.length} Pending Actions</span>
                    </div>
                </div>

                {/* Pending Queue List */}
                {loading ? (
                    <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 shadow-sm text-slate-500">Loading pending requests...</div>
                ) : pendingLeaves.length === 0 ? (
                    <div className="bg-white p-16 flex flex-col items-center justify-center rounded-2xl border border-emerald-100 shadow-sm">
                        <div className="h-16 w-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-3xl mb-4">🏆</div>
                        <h3 className="text-xl font-bold text-slate-800">Inbox Zero!</h3>
                        <p className="text-slate-500 mt-2">There are no pending leave requests to review right now.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {pendingLeaves.map((request) => {
                            const diffTime = Math.abs(new Date(request.endDate).getTime() - new Date(request.startDate).getTime());
                            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

                            return (
                                <div key={request._id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between hover:shadow-md transition-shadow">

                                    {/* Card Top */}
                                    <div>
                                        <div className="flex justify-between items-start border-b border-slate-100 pb-4 mb-4">
                                            <div>
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Employee ID</p>
                                                <p className="text-lg font-black text-indigo-700">{request.employeeId}</p>
                                            </div>
                                            <div className="text-right">
                                                <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full border border-indigo-100">
                                                    {request.leaveType} Leave
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex space-x-6 mb-4">
                                            <div>
                                                <p className="text-xs text-slate-500 mb-1">Duration</p>
                                                <p className="font-bold text-slate-700">{diffDays} Days</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500 mb-1">Date Range</p>
                                                <p className="font-medium text-slate-700 text-sm">
                                                    {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                            <p className="text-xs font-bold text-slate-500 mb-2">Employee&apos;s Reason</p>
                                            <p className="text-sm text-slate-800">&quot;{request.reason}&quot;</p>
                                        </div>
                                    </div>

                                    {/* Actions Bottom */}
                                    <div className="mt-6 pt-6 border-t border-slate-100 flex space-x-3">
                                        <button
                                            disabled={processingId === request._id}
                                            onClick={() => handleAction(request._id, 'Approved')}
                                            className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white font-bold rounded-xl flex items-center justify-center space-x-2 transition-colors disabled:opacity-50"
                                        >
                                            <span>✓</span> <span>Approve</span>
                                        </button>

                                        <button
                                            disabled={processingId === request._id}
                                            onClick={() => setRejectingId(request._id)}
                                            className="flex-1 py-2.5 bg-white border border-rose-200 hover:border-rose-400 hover:bg-rose-50 text-rose-600 font-bold rounded-xl flex items-center justify-center space-x-2 transition-colors disabled:opacity-50"
                                        >
                                            <span>✕</span> <span>Reject</span>
                                        </button>
                                    </div>

                                </div>
                            );
                        })}
                    </div>
                )}

            </div>
        </div>
    );
}
