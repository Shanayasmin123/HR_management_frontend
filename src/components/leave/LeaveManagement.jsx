import React, { useState } from 'react';
import { Calendar, Clock, CheckCircle, XCircle, AlertCircle, Plus } from 'lucide-react';

const LeaveManagement = () => {
  const [filter, setFilter] = useState('all');
  
  const leaveRequests = [
    { id: 1, name: 'John Doe', type: 'Sick Leave', from: '2026-03-25', to: '2026-03-26', days: 2, status: 'pending', reason: 'Flu and fever' },
    { id: 2, name: 'Jane Smith', type: 'Vacation', from: '2026-04-10', to: '2026-04-15', days: 5, status: 'approved', reason: 'Family vacation' },
    { id: 3, name: 'Mike Johnson', type: 'Personal Leave', from: '2026-03-28', to: '2026-03-28', days: 1, status: 'pending', reason: 'Personal work' },
    { id: 4, name: 'Sarah Williams', type: 'Sick Leave', from: '2026-03-26', to: '2026-03-27', days: 2, status: 'rejected', reason: 'Doctor appointment' },
  ];

  const filteredRequests = filter === 'all' ? leaveRequests : leaveRequests.filter(r => r.status === filter);

  const getStatusBadge = (status) => {
    switch(status) {
      case 'approved':
        return <span className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded text-xs"><CheckCircle size={12} /> Approved</span>;
      case 'rejected':
        return <span className="flex items-center gap-1 text-red-600 bg-red-50 px-2 py-1 rounded text-xs"><XCircle size={12} /> Rejected</span>;
      default:
        return <span className="flex items-center gap-1 text-yellow-600 bg-yellow-50 px-2 py-1 rounded text-xs"><AlertCircle size={12} /> Pending</span>;
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Leave Management</h1>
          <p className="text-gray-500 mt-1">Manage employee leave requests</p>
        </div>
        <button className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-purple-700">
          <Plus size={18} />
          Apply for Leave
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Leave Balance</p>
              <p className="text-2xl font-bold text-gray-800">18</p>
              <p className="text-xs text-gray-400">Days remaining</p>
            </div>
            <Calendar size={32} className="text-purple-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending Requests</p>
              <p className="text-2xl font-bold text-yellow-600">2</p>
              <p className="text-xs text-gray-400">Awaiting approval</p>
            </div>
            <Clock size={32} className="text-yellow-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Approved This Month</p>
              <p className="text-2xl font-bold text-green-600">5</p>
              <p className="text-xs text-gray-400">Total approved</p>
            </div>
            <CheckCircle size={32} className="text-green-500" />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-xl border border-gray-200 mb-6">
        <div className="flex gap-2 p-4 border-b border-gray-200">
          {['all', 'pending', 'approved', 'rejected'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                filter === tab ? 'bg-purple-100 text-purple-600' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="divide-y divide-gray-200">
          {filteredRequests.map((request) => (
            <div key={request.id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-gray-800">{request.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{request.reason}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                    <span>{request.type}</span>
                    <span>{request.from} to {request.to} ({request.days} days)</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {getStatusBadge(request.status)}
                  {request.status === 'pending' && (
                    <div className="flex gap-2">
                      <button className="text-green-600 hover:text-green-700 text-sm font-medium">Approve</button>
                      <button className="text-red-600 hover:text-red-700 text-sm font-medium">Reject</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LeaveManagement;