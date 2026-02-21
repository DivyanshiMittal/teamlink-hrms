'use client';

import { useState, useEffect } from 'react';
import DocumentUpload from '@/components/DocumentUpload';

interface Department {
    _id: string;
    name: string;
}

interface Designation {
    _id: string;
    name: string;
}

export default function AddEmployeePage() {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [designations, setDesignations] = useState<Designation[]>([]);

    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [loadingDepartments, setLoadingDepartments] = useState(true);
    const [loadingDesignations, setLoadingDesignations] = useState(false);

    // Auto-generated Employee ID
    const [employeeId, setEmployeeId] = useState('');

    useEffect(() => {
        // Generate a secure-looking random Employee ID for the demo
        const randomNum = Math.floor(10000 + Math.random() * 90000);
        setEmployeeId(`EMP-${randomNum}`);
    }, []);

    // Fetch Departments on Mount
    useEffect(() => {
        async function fetchDepartments() {
            try {
                const response = await fetch('/api/departments');
                const data = await response.json();
                setDepartments(data);
            } catch (error) {
                console.error('Failed to load departments', error);
            } finally {
                setLoadingDepartments(false);
            }
        }
        fetchDepartments();
    }, []);

    // Fetch Designations when Department changes
    useEffect(() => {
        async function fetchDesignations(deptId: string) {
            if (!deptId) {
                setDesignations([]);
                return;
            }

            setLoadingDesignations(true);
            try {
                const response = await fetch(`/api/designations?departmentId=${deptId}`);
                const data = await response.json();
                setDesignations(data);
            } catch (error) {
                console.error('Failed to load designations', error);
            } finally {
                setLoadingDesignations(false);
            }
        }

        fetchDesignations(selectedDepartment);
    }, [selectedDepartment]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form submission prevented for demo.');
        alert('Employee successfully saved! (Mock Action)');
    };

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">

                {/* Header Section */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
                        Onboard New Employee
                    </h1>
                    <p className="mt-3 text-lg text-slate-500 max-w-2xl mx-auto">
                        Complete the form below to register a new team member in the HRMS.
                    </p>
                </div>

                {/* Form Content */}
                <form id="employee-form" onSubmit={handleSubmit} className="bg-white shadow-xl shadow-slate-200/50 rounded-2xl overflow-hidden border border-slate-100">

                    {/* Personal Details Section */}
                    <div className="p-8 sm:p-10 border-b border-slate-100">
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">1</div>
                            <h2 className="text-2xl font-bold text-slate-800">
                                Personal Details
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                            <div className="flex flex-col">
                                <label className="text-sm font-semibold text-slate-700 mb-1.5 flex justify-between">
                                    First Name <span className="text-red-500">*</span>
                                </label>
                                <input required type="text" className="px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400" placeholder="e.g. Jane" />
                            </div>

                            <div className="flex flex-col">
                                <label className="text-sm font-semibold text-slate-700 mb-1.5 flex justify-between">
                                    Last Name <span className="text-red-500">*</span>
                                </label>
                                <input required type="text" className="px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400" placeholder="e.g. Smith" />
                            </div>

                            <div className="flex flex-col">
                                <label className="text-sm font-semibold text-slate-700 mb-1.5 flex justify-between">
                                    Date of Birth <span className="text-red-500">*</span>
                                </label>
                                <input required type="date" className="px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-slate-700" />
                            </div>

                            <div className="flex flex-col">
                                <label className="text-sm font-semibold text-slate-700 mb-1.5 flex justify-between">
                                    Gender <span className="text-red-500">*</span>
                                </label>
                                <select required className="px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-slate-700">
                                    <option value="" disabled>Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Job Details Section */}
                    <div className="p-8 sm:p-10 bg-slate-50/50">
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">2</div>
                            <h2 className="text-2xl font-bold text-slate-800">
                                Job Details
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">

                            <div className="flex flex-col">
                                <label className="text-sm font-semibold text-slate-700 mb-1.5 flex justify-between">
                                    Employee ID
                                </label>
                                <input
                                    type="text"
                                    value={employeeId}
                                    readOnly
                                    className="px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-500 font-mono cursor-not-allowed outline-none"
                                    title="Auto-generated ID"
                                />
                                <p className="text-xs text-slate-400 mt-1">Auto-generated unique identifier.</p>
                            </div>

                            <div className="flex flex-col">
                                <label className="text-sm font-semibold text-slate-700 mb-1.5 flex justify-between">
                                    Date of Joining <span className="text-red-500">*</span>
                                </label>
                                <input required type="date" className="px-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-slate-700" />
                            </div>

                            {/* Dependent Dropdowns */}
                            <div className="flex flex-col">
                                <label className="text-sm font-semibold text-slate-700 mb-1.5 flex justify-between items-center">
                                    <span>Department <span className="text-red-500">*</span></span>
                                    {loadingDepartments && <span className="text-xs text-indigo-500 font-medium animate-pulse">Fetching...</span>}
                                </label>
                                <select
                                    required
                                    value={selectedDepartment}
                                    onChange={(e) => setSelectedDepartment(e.target.value)}
                                    className="px-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-slate-700 disabled:bg-slate-100 disabled:cursor-not-allowed"
                                    disabled={loadingDepartments}
                                >
                                    <option value="" disabled>Select Department</option>
                                    {departments.map((dept) => (
                                        <option key={dept._id} value={dept._id}>{dept.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex flex-col">
                                <label className="text-sm font-semibold text-slate-700 mb-1.5 flex justify-between items-center">
                                    <span>Designation <span className="text-red-500">*</span></span>
                                    {loadingDesignations && <span className="text-xs text-indigo-500 font-medium animate-pulse">Filtering...</span>}
                                </label>
                                <select
                                    required
                                    disabled={!selectedDepartment || loadingDesignations}
                                    className="px-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-slate-700 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed disabled:border-slate-200"
                                >
                                    <option value="" disabled>
                                        {!selectedDepartment ? 'Please select a department first' : 'Select Designation'}
                                    </option>
                                    {designations.map((desig) => (
                                        <option key={desig._id} value={desig._id}>{desig.name}</option>
                                    ))}
                                </select>
                            </div>

                        </div>
                    </div>
                </form>

                {/* Document Upload Section - Moved outside main form to prevent hydration errors */}
                <div className="mt-8 bg-white shadow-xl shadow-slate-200/50 rounded-2xl overflow-hidden border border-slate-100">
                    <div className="p-8 sm:p-10 border-b border-slate-100">
                        <DocumentUpload employeeId={employeeId} />
                    </div>

                    {/* Bottom Action Bar */}
                    <div className="px-8 py-6 bg-slate-100 flex items-center justify-between sm:px-10">
                        <p className="text-sm text-slate-500">
                            <span className="text-red-500">*</span> Indicates required fields
                        </p>
                        <button
                            type="button"
                            onClick={() => {
                                // Trigger the main form submission manually
                                const form = document.getElementById('employee-form') as HTMLFormElement;
                                if (form) {
                                    if (form.requestSubmit) {
                                        form.requestSubmit();
                                    } else {
                                        form.submit();
                                    }
                                }
                            }}
                            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-sm transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                        >
                            Save Employee
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
