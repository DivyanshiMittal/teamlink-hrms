'use client';

import { useState, useEffect, useRef } from 'react';

// Hardcoded Employee For Demo
const MOCK_CURRENT_USER = 'EMP-DEMO';

interface Payslip {
    _id: string;
    employeeId: string;
    targetMonth: string;
    targetYear: string;
    basicSalary: number;
    hra: number;
    specialAllowance: number;
    pf: number;
    professionalTax: number;
    netSalary: number;
    status: string;
    createdAt: string;
}

export default function EmployeePayslipsPage() {
    const [payslips, setPayslips] = useState<Payslip[]>([]);
    const [loading, setLoading] = useState(true);

    const [viewingSlip, setViewingSlip] = useState<Payslip | null>(null);
    const slipRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchPayslips();
    }, []);

    const fetchPayslips = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/payroll?employeeId=${MOCK_CURRENT_USER}`);
            if (res.ok) {
                const data = await res.json();
                setPayslips(data);
            }
        } catch (error) {
            console.error('Failed to fetch payslips', error);
        } finally {
            setLoading(false);
        }
    };

    const downloadPDF = async () => {
        if (!slipRef.current || !viewingSlip) return;

        // Dynamically import html2pdf so it only executes on the client and avoids SSR 'self is not defined' errors
        const html2pdf = (await import('html2pdf.js')).default;

        const opt = {
            margin: 0.5,
            filename: `Payslip_${MOCK_CURRENT_USER}_${viewingSlip.targetMonth}_${viewingSlip.targetYear}.pdf`,
            image: { type: 'jpeg' as const, quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' as const }
        };

        html2pdf().set(opt).from(slipRef.current).save().catch((err: Error) => console.log('PDF Generation Error:', err));
    };

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8 relative">

                {/* PDF Modal Viewer */}
                {viewingSlip && (
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh]">

                            {/* Modal Header */}
                            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-2xl">
                                <h3 className="text-xl font-bold text-slate-800">Payslip Output</h3>
                                <div className="flex space-x-3">
                                    <button onClick={downloadPDF} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-sm transition-colors text-sm flex items-center space-x-2">
                                        <span>⬇️</span> <span>Download PDF</span>
                                    </button>
                                    <button onClick={() => setViewingSlip(null)} className="px-4 py-2 bg-white border border-slate-200 text-slate-600 font-bold rounded-lg hover:bg-slate-100 transition-colors text-sm">
                                        Close
                                    </button>
                                </div>
                            </div>

                            {/* Print Container Layout - Scrolling */}
                            <div className="overflow-y-auto w-full flex justify-center p-6 bg-slate-200/50">
                                {/* The Hidden Component we actually send to HTML2PDF */}
                                <div className="bg-white p-8 w-[800px] max-w-full shadow-md print-mode-wrapper" ref={slipRef}>

                                    <div className="border-b-2 border-slate-800 pb-6 mb-6">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Nexus HRMS Co.</h1>
                                                <p className="text-sm text-slate-500 mt-1">100 Tech Park, Suite 400 • NY 10001</p>
                                            </div>
                                            <div className="text-right">
                                                <h2 className="text-2xl font-bold text-indigo-700 uppercase">Payslip</h2>
                                                {(() => {
                                                    const dMonth = parseInt(viewingSlip.targetMonth) - 1;
                                                    return <p className="text-sm font-bold text-slate-500">{new Date(parseInt(viewingSlip.targetYear), dMonth).toLocaleString('default', { month: 'long' })} {viewingSlip.targetYear}</p>;
                                                })()}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-8 mb-8">
                                        <div>
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Employee Info</p>
                                            <p className="text-lg font-bold text-slate-800">{viewingSlip.employeeId}</p>
                                            <p className="text-slate-600 text-sm mt-1">Full-Time Software Engineer</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Generated On</p>
                                            <p className="text-slate-800 text-sm font-medium">{new Date(viewingSlip.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-8 mb-8 border border-slate-200 rounded-xl overflow-hidden">
                                        <div className="p-0 border-r border-slate-200">
                                            <div className="bg-slate-50 px-4 py-3 border-b border-slate-200"><h4 className="font-bold text-slate-800 text-sm uppercase">Earnings</h4></div>
                                            <div className="p-4 space-y-3">
                                                <div className="flex justify-between"><span className="text-slate-600 text-sm">Basic Salary</span> <span className="font-medium text-slate-900">${viewingSlip.basicSalary.toLocaleString()}</span></div>
                                                <div className="flex justify-between"><span className="text-slate-600 text-sm">House Rent Allowance (HRA)</span> <span className="font-medium text-slate-900">${viewingSlip.hra.toLocaleString()}</span></div>
                                                <div className="flex justify-between"><span className="text-slate-600 text-sm">Special Allowance</span> <span className="font-medium text-slate-900">${viewingSlip.specialAllowance.toLocaleString()}</span></div>
                                            </div>
                                        </div>
                                        <div className="p-0">
                                            <div className="bg-slate-50 px-4 py-3 border-b border-slate-200"><h4 className="font-bold text-slate-800 text-sm uppercase">Deductions</h4></div>
                                            <div className="p-4 space-y-3">
                                                <div className="flex justify-between"><span className="text-rose-600/80 text-sm">Provident Fund (PF)</span> <span className="font-medium text-rose-700">-${viewingSlip.pf.toLocaleString()}</span></div>
                                                <div className="flex justify-between"><span className="text-rose-600/80 text-sm">Professional Tax</span> <span className="font-medium text-rose-700">-${viewingSlip.professionalTax.toLocaleString()}</span></div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-indigo-50 border-2 border-indigo-200 p-6 rounded-xl flex justify-between items-center mb-12">
                                        <span className="font-black text-indigo-900 text-xl uppercase tracking-wider">Net Salary</span>
                                        <span className="font-black text-indigo-700 text-3xl">${viewingSlip.netSalary.toLocaleString()}</span>
                                    </div>

                                    <div className="text-center pt-8 border-t border-slate-200">
                                        <p className="text-xs text-slate-400 font-medium">This is a system generated document and does not require a signature.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}


                {/* Main Page Layout */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-800">My Payslips</h1>
                        <p className="text-slate-500 mt-1">Hello, Employee {MOCK_CURRENT_USER}</p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                    <div className="bg-slate-50 border-b border-slate-100 px-6 py-5 flex justify-between items-center">
                        <h2 className="text-lg font-bold text-slate-800">Salary Documentation</h2>
                        <span className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full font-bold">{payslips.length} Available</span>
                    </div>

                    <div className="p-0">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-white border-b border-slate-100 text-slate-400 text-xs uppercase tracking-wider">
                                    <th className="py-4 px-6 font-semibold">Pay Period</th>
                                    <th className="py-4 px-6 font-semibold">Net Pay</th>
                                    <th className="py-4 px-6 font-semibold">Date Generated</th>
                                    <th className="py-4 px-6 font-semibold text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {loading ? (
                                    <tr><td colSpan={4} className="py-12 text-center text-slate-400">Loading your payslips...</td></tr>
                                ) : payslips.length === 0 ? (
                                    <tr><td colSpan={4} className="py-16 text-center text-slate-500 bg-slate-50/50">No payslips have been generated for you yet.</td></tr>
                                ) : (
                                    payslips.map(slip => {
                                        const rMonth = parseInt(slip.targetMonth) - 1;
                                        const rName = new Date(parseInt(slip.targetYear), rMonth).toLocaleString('default', { month: 'long' });

                                        return (
                                            <tr key={slip._id} className="hover:bg-slate-50 transition-colors group">
                                                <td className="py-5 px-6 font-bold text-slate-800 text-lg uppercase tracking-wide">
                                                    {rName} {slip.targetYear}
                                                </td>
                                                <td className="py-5 px-6 font-black text-emerald-600 text-lg">
                                                    ${slip.netSalary.toLocaleString()}
                                                </td>
                                                <td className="py-5 px-6 text-sm text-slate-500 font-medium">
                                                    {new Date(slip.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="py-5 px-6 text-right">
                                                    <button
                                                        onClick={() => setViewingSlip(slip)}
                                                        className="px-5 py-2.5 bg-white border-2 border-slate-200 hover:border-indigo-600 hover:text-indigo-600 text-slate-600 font-bold rounded-xl transition-all shadow-sm group-hover:shadow"
                                                    >
                                                        View Payslip
                                                    </button>
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
    );
}
