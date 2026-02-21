'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
    const pathname = usePathname();

    const navSections = [
        {
            title: 'Employee Management',
            links: [
                { name: 'Employee Directory', href: '/dashboard' },
                { name: 'Add New Employee', href: '/add-employee' },
            ]
        },
        {
            title: 'Attendance',
            links: [
                { name: 'My Attendance', href: '/attendance' },
                { name: 'HR Attendance Dashboard', href: '/attendance/admin' },
            ]
        },
        {
            title: 'Leave',
            links: [
                { name: 'Request Leave', href: '/leave' },
                { name: 'Leave Approvals', href: '/leave/admin' },
            ]
        },
        {
            title: 'Payroll',
            links: [
                { name: 'My Payslips', href: '/payroll' },
                { name: 'Run Payroll', href: '/payroll/admin' },
            ]
        }
    ];

    return (
        <div className="w-72 bg-slate-900 min-h-screen text-slate-300 flex flex-col shadow-2xl z-20 sticky top-0 h-screen overflow-y-auto hidden lg:flex">

            {/* Branding */}
            <div className="p-6 border-b border-slate-800 bg-slate-950/50">
                <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-900/50">
                        N
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-white tracking-tight uppercase">Teamlink <span className="text-indigo-500">Consultants</span></h1>
                        <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Admin Portal</p>
                    </div>
                </div>
            </div>

            {/* Navigation Links */}
            <div className="flex-1 py-6 px-4 space-y-8">
                {navSections.map((section, idx) => (
                    <div key={idx}>
                        <h3 className="px-3 text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
                            {section.title}
                        </h3>
                        <nav className="space-y-1">
                            {section.links.map((link) => {
                                const isActive = pathname === link.href;
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group
                                            ${isActive
                                                ? 'bg-indigo-600/10 text-indigo-400 font-bold'
                                                : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                                            }
                                        `}
                                    >
                                        <div className={`w-1.5 h-1.5 rounded-full mr-3 transition-colors duration-200
                                            ${isActive ? 'bg-indigo-500' : 'bg-slate-700 group-hover:bg-slate-500'}
                                        `} />
                                        {link.name}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>
                ))}
            </div>

            {/* User Profile Mock */}
            <div className="p-4 border-t border-slate-800 bg-slate-900">
                <div className="flex items-center p-3 cursor-pointer hover:bg-slate-800 rounded-xl transition-colors">
                    <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center border-2 border-slate-700">
                        <span className="text-indigo-800 font-bold text-sm">JS</span>
                    </div>
                    <div className="ml-3">
                        <p className="text-sm font-bold text-white">John Smith</p>
                        <p className="text-xs font-medium text-slate-500">Super Admin</p>
                    </div>
                </div>
            </div>

        </div>
    );
}
