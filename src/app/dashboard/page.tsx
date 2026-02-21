'use client';

import { useState, useEffect } from 'react';

interface PopulatedField {
    _id: string;
    name: string;
}

interface EmployeeRecord {
    _id: string;
    employeeId: string;
    firstName: string;
    lastName: string;
    email: string;
    personalContactNumber: string;
    department: PopulatedField;
    designation: PopulatedField;
}

export default function EmployeeDashboard() {
    const [employees, setEmployees] = useState<EmployeeRecord[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/employees');
            if (res.ok) {
                const data = await res.json();
                setEmployees(data);
            }
        } catch (error) {
            console.error('Failed to fetch employees', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-800">Employee Directory</h1>
                        <p className="text-slate-500 mt-1">View and manage all active team members across the organization.</p>
                    </div>
                    <div className="mt-4 md:mt-0 flex space-x-3">
                        <div className="px-5 py-2.5 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center space-x-2">
                            <span className="text-indigo-600 font-bold text-xl">{employees.length}</span>
                            <span className="text-indigo-800 text-sm font-semibold uppercase tracking-wide">Total Staff</span>
                        </div>
                    </div>
                </div>

                {/* Directory Table */}
                <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                    <div className="bg-slate-50 border-b border-slate-100 px-6 py-4 flex justify-between items-center">
                        <h2 className="text-lg font-bold text-slate-800">Global Registry</h2>
                        <button onClick={fetchEmployees} className="text-sm text-indigo-600 hover:text-indigo-800 font-semibold transition-colors">
                            ↻ Sync Database
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-white border-b border-slate-100 text-slate-400 text-xs uppercase tracking-wider">
                                    <th className="py-4 px-6 font-semibold">Employee ID</th>
                                    <th className="py-4 px-6 font-semibold">Full Name</th>
                                    <th className="py-4 px-6 font-semibold">Role & Department</th>
                                    <th className="py-4 px-6 font-semibold text-right">Contact</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {loading ? (
                                    // Loading Skeletons
                                    [1, 2, 3, 4, 5].map((i) => (
                                        <tr key={i} className="animate-pulse">
                                            <td className="py-5 px-6"><div className="h-4 bg-slate-200 rounded w-24"></div></td>
                                            <td className="py-5 px-6"><div className="h-5 bg-slate-200 rounded w-40"></div></td>
                                            <td className="py-5 px-6">
                                                <div className="h-4 bg-slate-200 rounded w-32 mb-2"></div>
                                                <div className="h-3 bg-slate-100 rounded w-20"></div>
                                            </td>
                                            <td className="py-5 px-6 flex justify-end"><div className="h-4 bg-slate-200 rounded w-32"></div></td>
                                        </tr>
                                    ))
                                ) : employees.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="py-16 text-center">
                                            <div className="text-5xl mb-4">📭</div>
                                            <h3 className="text-lg font-bold text-slate-800">No Employees Found</h3>
                                            <p className="text-slate-500 mt-1 mb-6">The registry is currently empty.</p>
                                            <a href="/add-employee" className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-sm">
                                                Add First Employee
                                            </a>
                                        </td>
                                    </tr>
                                ) : (
                                    employees.map((emp) => (
                                        <tr key={emp._id} className="hover:bg-slate-50 transition-colors group">
                                            <td className="py-4 px-6 font-black text-indigo-600">
                                                {emp.employeeId}
                                            </td>
                                            <td className="py-4 px-6">
                                                <p className="font-bold text-slate-900 text-lg">{emp.firstName} {emp.lastName}</p>
                                            </td>
                                            <td className="py-4 px-6">
                                                <p className="font-bold text-slate-700">{emp.designation?.name || 'Unassigned Role'}</p>
                                                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mt-0.5">{emp.department?.name || 'Unassigned Dept'}</p>
                                            </td>
                                            <td className="py-4 px-6 text-right">
                                                <p className="text-sm font-medium text-slate-800">{emp.email}</p>
                                                <p className="text-xs text-slate-400 mt-0.5">{emp.personalContactNumber}</p>
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
