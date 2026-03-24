import React from 'react';
import { Users, Briefcase, Calendar, DollarSign, TrendingUp, Clock } from 'lucide-react';

const Dashboard = () => {
  const stats = [
    { title: 'Total Employees', value: '156', icon: Users, color: 'bg-blue-500', change: '+12%' },
    { title: 'Departments', value: '16', icon: Briefcase, color: 'bg-purple-500', change: '+2' },
    { title: 'On Leave Today', value: '8', icon: Calendar, color: 'bg-orange-500', change: '-3' },
    { title: 'Payroll This Month', value: '$45.2K', icon: DollarSign, color: 'bg-green-500', change: '+8%' },
  ];

  const recentActivities = [
    { user: 'John Doe', action: 'Applied for leave', time: '10 minutes ago', status: 'pending' },
    { user: 'Jane Smith', action: 'Completed onboarding', time: '1 hour ago', status: 'completed' },
    { user: 'Mike Johnson', action: 'Submitted timesheet', time: '3 hours ago', status: 'pending' },
    { user: 'Sarah Williams', action: 'Updated profile', time: '5 hours ago', status: 'completed' },
  ];

  const upcomingHolidays = [
    { name: 'Holi', date: 'March 25, 2026', day: 'Wednesday' },
    { name: 'Good Friday', date: 'April 3, 2026', day: 'Friday' },
    { name: 'Ram Navami', date: 'April 10, 2026', day: 'Friday' },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back, Sarah! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon size={24} className="text-white" />
              </div>
              <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                {stat.change}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
            <p className="text-gray-500 text-sm mt-1">{stat.title}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Recent Activities</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {recentActivities.map((activity, idx) => (
              <div key={idx} className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <Clock size={18} className="text-gray-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{activity.user}</p>
                    <p className="text-xs text-gray-500">{activity.action}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">{activity.time}</p>
                  <span className={`text-xs px-2 py-1 rounded mt-1 inline-block ${
                    activity.status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                  }`}>
                    {activity.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Holidays */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Upcoming Holidays</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {upcomingHolidays.map((holiday, idx) => (
              <div key={idx} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-800">{holiday.name}</p>
                  <p className="text-sm text-gray-500">{holiday.day}</p>
                </div>
                <p className="text-sm text-purple-600 font-medium">{holiday.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;