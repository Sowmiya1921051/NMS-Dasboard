import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Reports() {
    const [reports, setReports] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const response = await axios.get('https://bank.infiscripts.com/report.php');
                if (response.data.status === 'success') {
                    setReports(response.data.reports);
                } else {
                    alert('Failed to fetch reports.');
                }
            } catch (error) {
                console.error('Error fetching reports:', error);
                alert('An error occurred while fetching reports.');
            }
        };
        fetchReports();
    }, []);

    return (
        <div className="container mx-auto p-4">
            <button
                className="absolute top-4 right-4 bg-red-600 text-white px-4 py-2 rounded-full shadow-md hover:bg-red-700 transition"
                onClick={() => navigate(-1)}
            >
                Close
            </button>

            <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Reports</h2>
            {reports.length > 0 ? (
                <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
                    <table className="min-w-full table-auto text-gray-800">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="py-4 px-6 text-sm font-medium text-left border-b">Reporting By </th>
                                <th className="py-4 px-6 text-sm font-medium text-left border-b">Reported Profile Name</th>
                                <th className="py-4 px-6 text-sm font-medium text-left border-b">Email</th>
                                <th className="py-4 px-6 text-sm font-medium text-left border-b">Mobile</th>
                                <th className="py-4 px-6 text-sm font-medium text-left border-b">Reported At</th>
                                <th className="py-4 px-6 text-sm font-medium text-left border-b">Verified</th>
                            </tr>
                        </thead>
                        <tbody className="bg-gray-50">
                            {reports.map((report) => (
                                <tr key={report.report_id} className="border-b hover:bg-gray-100">
                                    <td className="py-4 px-6 text-sm">{report.reporter_id}</td>
                                    <td className="py-4 px-6 text-sm">{report.profile_name}</td>
                                    <td className="py-4 px-6 text-sm">{report.profile_email}</td>
                                    <td className="py-4 px-6 text-sm">{report.mobile_number}</td>
                                    <td className="py-4 px-6 text-sm">{report.reported_at}</td>
                                    <td className="py-4 px-6 text-sm">{report.verified === '1' ? 'Yes' : 'No'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-center text-gray-500">No reports available.</p>
            )}
        </div>
    );
}

export default Reports;
