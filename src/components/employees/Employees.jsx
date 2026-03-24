// pages/EmployeeList.jsx
import React, { useState, useMemo } from 'react';
import { 
  Edit, 
  Trash2, 
  Eye, 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  Plus, 
  Filter, 
  RefreshCw, 
  Download, 
  X 
} from 'lucide-react';
import DeleteConfirmationModal from './DeleteEmployee';
import UpdateDepartmentModal from './UpdateEmployee';
import CreateDepartmentModal from './CreateEmployee';

// Import separate modal components


const Employees = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    minCapacity: '',
    maxCapacity: '',
    yearFrom: '',
    yearTo: '',
    minEmployees: '',
    maxEmployees: ''
  });

  // Modal states
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  
  const [departments, setDepartments] = useState([
    {
      id: 1,
      department: "Computer Science",
      headOfDepartment: "Dr. John Doe",
      phone: "+1 234 567 890",
      email: "cs@university.edu",
      establishedYear: 2005,
      employeeCapacity: 50,
      totalEmployees: 42,
    },
    {
      id: 2,
      department: "Mathematics",
      headOfDepartment: "Prof. Jane Smith",
      phone: "+1 234 567 891",
      email: "math@university.edu",
      establishedYear: 1998,
      employeeCapacity: 30,
      totalEmployees: 28,
    },
    {
      id: 3,
      department: "Physics",
      headOfDepartment: "Dr. Robert Johnson",
      phone: "+1 234 567 892",
      email: "physics@university.edu",
      establishedYear: 2000,
      employeeCapacity: 40,
      totalEmployees: 35,
    }
  ]);

  // Handle create department
  const handleCreateDepartment = (newDepartmentData) => {
    const newDepartment = {
      id: Date.now(),
      ...newDepartmentData,
    };
    setDepartments([...departments, newDepartment]);
  };

  // Handle update department
  const handleUpdateDepartment = (updatedDepartment) => {
    setDepartments(
      departments.map((dept) =>
        dept.id === updatedDepartment.id ? updatedDepartment : dept
      )
    );
  };

  // Handle delete department
  const handleDeleteDepartment = () => {
    if (selectedDepartment) {
      setDepartments(departments.filter(dept => dept.id !== selectedDepartment.id));
      setSelectedDepartment(null);
    }
  };

  // Open modals
  const openCreateModal = () => setCreateModalOpen(true);
  const openUpdateModal = (department) => {
    setSelectedDepartment(department);
    setUpdateModalOpen(true);
  };
  const openDeleteModal = (department) => {
    setSelectedDepartment(department);
    setDeleteModalOpen(true);
  };

  // Filter and search logic
  const filteredData = useMemo(() => {
    return departments.filter(dept => {
      const matchesSearch = searchTerm === '' || 
        dept.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dept.headOfDepartment.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dept.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCapacity = (!filters.minCapacity || dept.employeeCapacity >= parseInt(filters.minCapacity)) &&
        (!filters.maxCapacity || dept.employeeCapacity <= parseInt(filters.maxCapacity));
      
      const matchesYear = (!filters.yearFrom || dept.establishedYear >= parseInt(filters.yearFrom)) &&
        (!filters.yearTo || dept.establishedYear <= parseInt(filters.yearTo));
      
      const matchesEmployees = (!filters.minEmployees || dept.totalEmployees >= parseInt(filters.minEmployees)) &&
        (!filters.maxEmployees || dept.totalEmployees <= parseInt(filters.maxEmployees));
      
      return matchesSearch && matchesCapacity && matchesYear && matchesEmployees;
    });
  }, [departments, searchTerm, filters]);

  // Pagination
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentDepartments = filteredData.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      minCapacity: '',
      maxCapacity: '',
      yearFrom: '',
      yearTo: '',
      minEmployees: '',
      maxEmployees: ''
    });
    setSearchTerm('');
    setCurrentPage(1);
  };

  const handleRefresh = () => {
    clearFilters();
  };

  const exportToExcel = () => {
    const exportData = filteredData.map(dept => ({
      'Department Name': dept.department,
      'Head of Department': dept.headOfDepartment,
      'Phone': dept.phone,
      'Email': dept.email,
      'Employee Capacity': dept.employeeCapacity,
      'Established Year': dept.establishedYear,
      'Total Employees': dept.totalEmployees
    }));

    const headers = Object.keys(exportData[0]);
    const csvData = [
      headers.join(','),
      ...exportData.map(row => headers.map(header => `"${row[header]}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `departments_export_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const hasActiveFilters = searchTerm !== '' || 
    filters.minCapacity !== '' || filters.maxCapacity !== '' ||
    filters.yearFrom !== '' || filters.yearTo !== '' ||
    filters.minEmployees !== '' || filters.maxEmployees !== '';

  return (
    <>
      <div className="w-full bg-white rounded-lg border border-gray-200 overflow-hidden relative">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-white">
          <h2 className="text-lg font-semibold text-gray-900">All Departments</h2>
        </div>

        {/* Search and Actions Bar */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search by department name, head, or email..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full pl-10 pr-10 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-2 rounded-lg border flex items-center gap-2 transition-colors ${
                  hasActiveFilters ? 'bg-purple-50 border-purple-200 text-purple-600' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Filter size={16} />
                <span className="text-sm">Filter</span>
                {hasActiveFilters && (
                  <span className="ml-1 w-2 h-2 bg-purple-600 rounded-full"></span>
                )}
              </button>
              
              <button 
                onClick={handleRefresh}
                className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                title="Refresh"
              >
                <RefreshCw size={16} />
                <span className="text-sm">Refresh</span>
              </button>
              
              <button 
                onClick={exportToExcel}
                className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                title="Export to Excel"
              >
                <Download size={16} />
                <span className="text-sm">Export</span>
              </button>
              
              <button 
                onClick={openCreateModal}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-purple-700 transition-colors"
              >
                <Plus size={16} />
                <span className="text-sm">Add Department</span>
              </button>
            </div>
          </div>

          {/* Advanced Filters Panel */}
          {showFilters && (
            <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-700">Advanced Filters</h3>
                <button 
                  onClick={clearFilters}
                  className="text-xs text-purple-600 hover:text-purple-700 flex items-center gap-1"
                >
                  <X size={12} />
                  Clear all filters
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Employee Capacity Range</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.minCapacity}
                      onChange={(e) => setFilters({...filters, minCapacity: e.target.value})}
                      className="w-full px-3 py-1.5 border border-gray-200 rounded-md text-sm"
                    />
                    <span className="text-gray-400">-</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.maxCapacity}
                      onChange={(e) => setFilters({...filters, maxCapacity: e.target.value})}
                      className="w-full px-3 py-1.5 border border-gray-200 rounded-md text-sm"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Established Year Range</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="From"
                      value={filters.yearFrom}
                      onChange={(e) => setFilters({...filters, yearFrom: e.target.value})}
                      className="w-full px-3 py-1.5 border border-gray-200 rounded-md text-sm"
                    />
                    <span className="text-gray-400">-</span>
                    <input
                      type="number"
                      placeholder="To"
                      value={filters.yearTo}
                      onChange={(e) => setFilters({...filters, yearTo: e.target.value})}
                      className="w-full px-3 py-1.5 border border-gray-200 rounded-md text-sm"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Total Employees Range</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.minEmployees}
                      onChange={(e) => setFilters({...filters, minEmployees: e.target.value})}
                      className="w-full px-3 py-1.5 border border-gray-200 rounded-md text-sm"
                    />
                    <span className="text-gray-400">-</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.maxEmployees}
                      onChange={(e) => setFilters({...filters, maxEmployees: e.target.value})}
                      className="w-full px-3 py-1.5 border border-gray-200 rounded-md text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="text-xs text-gray-500">Active filters:</span>
              {searchTerm && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-50 text-purple-600 rounded-md text-xs">
                  Search: "{searchTerm}"
                  <button onClick={() => setSearchTerm('')} className="hover:text-purple-800">
                    <X size={12} />
                  </button>
                </span>
              )}
              {(filters.minCapacity || filters.maxCapacity) && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-50 text-purple-600 rounded-md text-xs">
                  Capacity: {filters.minCapacity || '0'} - {filters.maxCapacity || '∞'}
                  <button onClick={() => setFilters({...filters, minCapacity: '', maxCapacity: ''})} className="hover:text-purple-800">
                    <X size={12} />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="px-6 py-2 bg-gray-50/30 border-b border-gray-200">
          <p className="text-sm text-gray-500">
            Showing {filteredData.length} {filteredData.length === 1 ? 'department' : 'departments'}
            {hasActiveFilters && ' matching your filters'}
          </p>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Head of Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee Capacity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Established Year
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Employees
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {currentDepartments.length > 0 ? (
                currentDepartments.map((dept) => (
                  <tr key={dept.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {dept.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {dept.headOfDepartment}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {dept.phone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {dept.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {dept.employeeCapacity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {dept.establishedYear}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {dept.totalEmployees}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <button className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500 hover:text-blue-600 transition-colors">
                          <Eye size={16} />
                        </button>
                        <button 
                          onClick={() => openUpdateModal(dept)}
                          className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500 hover:text-purple-600 transition-colors"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => openDeleteModal(dept)}
                          className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500 hover:text-red-600 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                    No departments found matching your criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredData.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <span>Items per page:</span>
                <select
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                  className="px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </div>
              <span>
                Total Items: {startIndex + 1} - {Math.min(endIndex, totalItems)} of {totalItems}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-md border border-gray-300 text-gray-500 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`min-w-[32px] h-8 px-2 rounded-md text-sm font-medium transition-colors ${
                        currentPage === pageNum
                          ? 'bg-purple-600 text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-md border border-gray-300 text-gray-500 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Separate Modals - All with high z-index */}
      <CreateDepartmentModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onSubmit={handleCreateDepartment}
      />

      <UpdateDepartmentModal
        open={updateModalOpen}
        onOpenChange={setUpdateModalOpen}
        department={selectedDepartment}
        onUpdate={handleUpdateDepartment}
      />

      <DeleteConfirmationModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        departmentName={selectedDepartment?.department || ''}
        onConfirm={handleDeleteDepartment}
      />
    </>
  );
};

export default Employees;