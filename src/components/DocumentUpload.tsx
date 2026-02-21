'use client';

import { useState, useEffect } from 'react';

interface DocumentRecord {
    _id: string;
    fileName: string;
    documentType: string;
    uploadedBy: string;
    createdAt: string;
}

interface DocumentUploadProps {
    employeeId: string;
}

export default function DocumentUpload({ employeeId }: DocumentUploadProps) {
    const [documents, setDocuments] = useState<DocumentRecord[]>([]);
    const [loading, setLoading] = useState(true);

    const [file, setFile] = useState<File | null>(null);
    const [docType, setDocType] = useState('Resume');
    const [uploading, setUploading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    // Fetch documents on mount
    useEffect(() => {
        fetchDocuments();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [employeeId]);

    const fetchDocuments = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/documents?employeeId=${employeeId}`);
            if (res.ok) {
                const data = await res.json();
                setDocuments(data);
            }
        } catch (err) {
            console.error('Failed to load documents:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setErrorMsg('');
        }
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) {
            setErrorMsg('Please select a file first.');
            return;
        }

        setUploading(true);
        setErrorMsg('');

        const formData = new FormData();
        formData.append('file', file);
        formData.append('employeeId', employeeId);
        formData.append('documentType', docType);

        try {
            const res = await fetch('/api/documents/upload', {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || 'Upload failed');
            }

            // Reset form on success
            setFile(null);

            // We must cast the EventTarget type for TypeScript since we are accessing the DOM node
            const fileInput = document.getElementById('file-upload') as HTMLInputElement;
            if (fileInput) fileInput.value = '';

            await fetchDocuments();

        } catch (err: unknown) {
            if (err instanceof Error) {
                setErrorMsg(err.message);
            } else {
                setErrorMsg('An unexpected error occurred during upload.');
            }
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (docId: string) => {
        if (!confirm('Are you sure you want to delete this document?')) return;

        try {
            const res = await fetch(`/api/documents/${docId}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                await fetchDocuments();
            } else {
                alert('Failed to delete document');
            }
        } catch (err) {
            console.error('Delete error', err);
        }
    };

    return (
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100">

            <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                    <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path></svg>
                    Document Management
                </h2>
                <p className="text-slate-500 mt-1">Upload and manage secure employee files (PDF, JPG, PNG).</p>
            </div>

            {/* Upload Form */}
            <form onSubmit={handleUpload} className="bg-slate-50 p-6 rounded-xl border border-slate-200 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">

                    <div className="md:col-span-4">
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Document Type</label>
                        <select
                            value={docType}
                            onChange={(e) => setDocType(e.target.value)}
                            className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                        >
                            <option value="Resume">Resume / CV</option>
                            <option value="Government ID">Government ID</option>
                            <option value="Offer Letter">Offer Letter</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div className="md:col-span-5">
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Select File</label>
                        <input
                            id="file-upload"
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={handleFileChange}
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-600 file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition-all cursor-pointer"
                        />
                    </div>

                    <div className="md:col-span-3">
                        <button
                            type="submit"
                            disabled={uploading || !file}
                            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg disabled:bg-slate-400 disabled:cursor-not-allowed transition-all"
                        >
                            {uploading ? 'Uploading...' : 'Upload File'}
                        </button>
                    </div>
                </div>

                {errorMsg && <p className="mt-3 text-sm text-red-500 font-medium">{errorMsg}</p>}
            </form>

            {/* Document List */}
            <h3 className="text-lg font-bold text-slate-800 mb-4">Uploaded Documents</h3>

            {loading ? (
                <div className="text-center py-8 text-slate-500 animate-pulse">Loading documents...</div>
            ) : documents.length === 0 ? (
                <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-slate-500">
                    No documents uploaded yet.
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-100 text-slate-600 text-sm border-b border-slate-200">
                                <th className="py-3 px-4 font-semibold rounded-tl-lg">File Name</th>
                                <th className="py-3 px-4 font-semibold">Type</th>
                                <th className="py-3 px-4 font-semibold">Uploaded By</th>
                                <th className="py-3 px-4 font-semibold">Date</th>
                                <th className="py-3 px-4 font-semibold text-right rounded-tr-lg">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {documents.map((doc) => (
                                <tr key={doc._id} className="hover:bg-slate-50 transition-colors">
                                    <td className="py-3 px-4 flex items-center gap-3">
                                        <svg className="w-5 h-5 text-slate-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd"></path></svg>
                                        <span className="font-medium text-slate-700 truncate max-w-[200px]" title={doc.fileName}>{doc.fileName}</span>
                                    </td>
                                    <td className="py-3 px-4 text-sm text-slate-600">{doc.documentType}</td>
                                    <td className="py-3 px-4 text-sm text-slate-600">{doc.uploadedBy}</td>
                                    <td className="py-3 px-4 text-sm text-slate-500">
                                        {new Date(doc.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="flex justify-end gap-2">
                                            <a
                                                href={`/api/documents/${doc._id}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-100 hover:bg-emerald-200 rounded transition-colors"
                                            >
                                                View
                                            </a>
                                            <button
                                                onClick={() => handleDelete(doc._id)}
                                                className="px-3 py-1.5 text-xs font-medium text-red-700 bg-red-100 hover:bg-red-200 rounded transition-colors"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
