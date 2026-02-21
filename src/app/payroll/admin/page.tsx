'use client';

import { useState, useEffect } from 'react';

interface SalaryRecord {
    _id: string;
    employeeId: string;
    targetMonth: string;
    targetYear: string;
    netSalary: number;
    status: string;
    createdAt: string;
}

export default function AdminPayrollDashboard() {
    const [history, setHistory] = useState<SalaryRecord[]>([]);
    const [loading, setLoading] = useState(true);

    // Form State
    const [targetMonth, setTargetMonth] = useState('02');
    const [targetYear, setTargetYear] = useState('2026');
    const [generating, setGenerating] = useState(false);

    useEffect(() => {
        fetchPayrollHistory();
    }, []);

    const fetchPayrollHistory = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/payroll');
            if (res.ok) {
                const data = await res.json();
                setHistory(data);
            }
        } catch (error) {
            console.error('Failed to fetch payroll history', error);
        } finally {
            setLoading(false);
        }
    };

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        setGenerating(true);

        try {
            const res = await fetch('/api/payroll', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ targetMonth, targetYear })
            });

            const data = await res.json();
            if (!res.ok) {
                alert(data.error || 'Failed to generate payroll');
            } else {
                alert(data.message); // Should say e.g., generated 10, skipped 2
                fetchPayrollHistory();
            }
        } catch (error) {
            console.error('Generation error:', error);
            alert('An expected error occurred.');
        } finally {
            setGenerating(false);
        }
    };

    const currentMonthValue = parseInt(targetMonth) - 1; // 0-indexed for Date object
    const monthName = new Date(parseInt(targetYear), currentMonthValue).toLocaleString('default', { month: 'long' });

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-800">Payroll Processing</h1>
                        <p className="text-slate-500 mt-1">Generate and distribute monthly employee payslips.</p>
                    </div>
                    <div className="mt-4 md:mt-0 flex space-x-3">
                        <button className="px-4 py-2 border border-slate-300 text-slate-600 font-semibold rounded-lg hover:bg-slate-50 transition-colors">
                            Export Current Registry
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                    {/* Generate Panel */}
                    <div className="md:col-span-1">
                        <form onSubmit={handleGenerate} className="bg-white rounded-2xl shadow-xl shadow-slate-200 border border-slate-100 p-6 flex flex-col h-full">
                            <h2 className="text-lg font-bold text-slate-800 mb-6">Mass Generate Run</h2>

                            <div className="space-y-5 flex-1">
                                <div className="flex flex-col">
                                    <label className="text-sm font-semibold text-slate-700 mb-1.5 text-left">Target Month</label>
                                    <select required value={targetMonth} onChange={(e) => setTargetMonth(e.target.value)} className="px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none">
                                        <option value="01">January</option>
                                        <option value="02">February</option>
                                        <option value="03">March</option>
                                        <option value="04">April</option>
                                        <option value="05">May</option>
                                        <option value="06">June</option>
                                        <option value="07">July</option>
                                        <option value="08">August</option>
                                        <option value="09">September</option>
                                        <option value="10">October</option>
                                        <option value="11">November</option>
                                        <option value="12">December</option>
                                    </select>
                                </div>

                                <div className="flex flex-col">
                                    <label className="text-sm font-semibold text-slate-700 mb-1.5 text-left">Target Year</label>
                                    <select required value={targetYear} onChange={(e) => setTargetYear(e.target.value)} className="px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none">
                                        <option value="2025">2025</option>
                                        <option value="2026">2026</option>
                                    </select>
                                </div>

                                <div className="bg-amber-50 rounded-xl p-4 border border-amber-100 flex items-start space-x-3">
                                    <span className="text-amber-500 text-lg">⚠️</span>
                                    <p className="text-xs text-amber-800 font-medium">This will generate payslips for all active employees for {monthName} {targetYear}. It will skip employees who already have a payslip for this period.</p>
                                </div>
                            </div>

                            <button disabled={generating} type="submit" className="mt-6 w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                                {generating ? 'Processing Run...' : 'Execute Payroll Run'}
                            </button>
                        </form>
                    </div>

                    {/* Generated Ledger */}
                    <div className="md:col-span-2">
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden h-full flex flex-col">
                            <div className="bg-slate-50 border-b border-slate-100 px-6 py-4 flex justify-between items-center">
                                <h2 className="text-lg font-bold text-slate-800">Master Ledger</h2>
                                <button onClick={fetchPayrollHistory} className="text-sm text-indigo-600 hover:text-indigo-800 font-semibold transition-colors">
                                    ↻ Refresh
                                </button>
                            </div>

                            <div className="flex-1 overflow-x-auto p-0">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-white border-b border-slate-100 text-slate-400 text-xs uppercase tracking-wider">
                                            <th className="py-4 px-6 font-semibold">Employee</th>
                                            <th className="py-4 px-6 font-semibold">Period</th>
                                            <th className="py-4 px-6 font-semibold">Net Salary</th>
                                            <th className="py-4 px-6 font-semibold text-right">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {loading ? (
                                            <tr><td colSpan={4} className="py-12 text-center text-slate-400">Loading ledger...</td></tr>
                                        ) : history.length === 0 ? (
                                            <tr><td colSpan={4} className="py-12 text-center text-slate-400">No payroll data generated yet.</td></tr>
                                        ) : (
                                            history.map((record) => {
                                                const rMonth = parseInt(record.targetMonth) - 1;
                                                const rName = new Date(parseInt(record.targetYear), rMonth).toLocaleString('default', { month: 'short' });

                                                return (
                                                    <tr key={record._id} className="hover:bg-slate-50 transition-colors">
                                                        <td className="py-4 px-6 text-slate-900 font-bold">{record.employeeId}</td>
                                                        <td className="py-4 px-6 text-slate-600 font-medium">{rName} {record.targetYear}</td>
                                                        <td className="py-4 px-6 text-emerald-600 font-bold text-lg">${record.netSalary.toLocaleString()}</td>
                                                        <td className="py-4 px-6 text-right">
                                                            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100`}>
                                                                {record.status}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                )
                                            })
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
