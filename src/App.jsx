import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './pages/Sidebar';
import TopBar from './pages/TopBar';

// Import all pages
import Dashboard from './pages/Dashboard';
import EmployeeAttendance from './components/employees/EmployeeAttendance';
import LeaveManagement from './components/leave/LeaveManagement';

import Settings from './pages/Settings';
import Employees from './components/employees/Employees';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      <Sidebar sidebarOpen={sidebarOpen} />
      
      <main className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <TopBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        
        <div className="flex-1 overflow-auto p-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/employees/attendance" element={<EmployeeAttendance />} />
            <Route path="/leave-management" element={<LeaveManagement />} />
            
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default App;