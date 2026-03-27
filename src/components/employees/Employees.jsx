

import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Search,
  Plus,
  Filter,
  RefreshCw,
  Download,
  X,
  ChevronDown
} from 'lucide-react';
import { useAddNewUserMutation, useGetAllUserQuery } from "../../app/service/user";
import { useUpdateUserMutation } from "../../app/service/user";
import { useDeleteUserMutation } from "../../app/service/user";
import CreateEmployeeModal from './CreateEmployee';
import UpdateEmployeeModal from './UpdateEmployee';
import DeleteEmployeeModal from './DeleteEmployee';

const Employees = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    role: '',
    department: '',
    gender: '',
    status: '',
    activity: '' // ✅ Added activity filter
  });

  // Dropdown states
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showDepartmentDropdown, setShowDepartmentDropdown] = useState(false);
  const [showGenderDropdown, setShowGenderDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showActivityDropdown, setShowActivityDropdown] = useState(false); // ✅ Added activity dropdown state

  // Refs for dropdowns
  const roleDropdownRef = useRef(null);
  const departmentDropdownRef = useRef(null);
  const genderDropdownRef = useRef(null);
  const statusDropdownRef = useRef(null);
  const activityDropdownRef = useRef(null); // ✅ Added activity dropdown ref

  // Modal states
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // CRUD States
  const { data, isLoading, isError, refetch } = useGetAllUserQuery();
  const [addNewUser, { isLoading: isLoadingNewuser }] = useAddNewUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  const users = Array.isArray(data) ? data : data?.users || [];

  // Get unique values for filters
  const uniqueRoles = useMemo(() => [...new Set(users.map(emp => emp.role).filter(Boolean))], [users]);
  const uniqueDepartments = useMemo(() => [...new Set(users.map(emp => emp.department).filter(Boolean))], [users]);
  const uniqueGenders = useMemo(() => [...new Set(users.map(emp => emp.gender).filter(Boolean))], [users]);
  const uniqueStatuses = useMemo(() => [...new Set(users.map(emp => emp.status).filter(Boolean))], [users]);

  // Activity options
  const activityOptions = [
    { value: '', label: 'All Activities' },
    { value: 'active', label: 'Active Only' },
    { value: 'inactive', label: 'Inactive Only' }
  ];

  // Role options for dropdown
  const roleOptions = useMemo(() => [
    { value: '', label: 'All Roles' },
    ...uniqueRoles.map(role => ({ value: role, label: role }))
  ], [uniqueRoles]);

  const departmentOptions = useMemo(() => [
    { value: '', label: 'All Departments' },
    ...uniqueDepartments.map(dept => ({ value: dept, label: dept }))
  ], [uniqueDepartments]);

  const genderOptions = [
    { value: '', label: 'All Genders' },
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' }
  ];

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'On Duty', label: 'On Duty' },
    { value: 'On Leave', label: 'On Leave' },
  ];

  // Helper functions to get selected labels
  const getSelectedRoleLabel = () => {
    const option = roleOptions.find(opt => opt.value === filters.role);
    return option ? option.label : 'All Roles';
  };

  const getSelectedDepartmentLabel = () => {
    const option = departmentOptions.find(opt => opt.value === filters.department);
    return option ? option.label : 'All Departments';
  };

  const getSelectedGenderLabel = () => {
    const option = genderOptions.find(opt => opt.value === filters.gender);
    return option ? option.label : 'All Genders';
  };

  const getSelectedStatusLabel = () => {
    const option = statusOptions.find(opt => opt.value === filters.status);
    return option ? option.label : 'All Status';
  };

  const getSelectedActivityLabel = () => {
    const option = activityOptions.find(opt => opt.value === filters.activity);
    return option ? option.label : 'All Activities';
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (roleDropdownRef.current && !roleDropdownRef.current.contains(event.target)) {
        setShowRoleDropdown(false);
      }
      if (departmentDropdownRef.current && !departmentDropdownRef.current.contains(event.target)) {
        setShowDepartmentDropdown(false);
      }
      if (genderDropdownRef.current && !genderDropdownRef.current.contains(event.target)) {
        setShowGenderDropdown(false);
      }
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target)) {
        setShowStatusDropdown(false);
      }
      if (activityDropdownRef.current && !activityDropdownRef.current.contains(event.target)) {
        setShowActivityDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter and search logic with activity filter
  const filteredData = useMemo(() => {
    return users.filter((emp) => {
      const search = searchTerm.toLowerCase();
      const fullName = `${emp.firstName} ${emp.lastName}`.toLowerCase();

      const matchesSearch =
        fullName.includes(search) ||
        emp?.role?.toLowerCase().includes(search) ||
        emp?.email?.toLowerCase().includes(search) ||
        emp?.department?.toLowerCase().includes(search) ||
        emp?.mobile?.includes(search);

      const matchesRole = !filters.role || emp.role === filters.role;
      const matchesDepartment = !filters.department || emp.department === filters.department;
      const matchesGender = !filters.gender || emp.gender === filters.gender;
      const matchesStatus = !filters.status || emp.status === filters.status;

      // ✅ Activity filter logic
      const matchesActivity = !filters.activity ||
        (filters.activity === 'active' && emp.isActive === true) ||
        (filters.activity === 'inactive' && emp.isActive === false);

      return matchesSearch && matchesRole && matchesDepartment && matchesGender && matchesStatus && matchesActivity;
    });
  }, [users, searchTerm, filters]);

  // Pagination
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentEmployees = filteredData.slice(startIndex, startIndex + itemsPerPage);
  const startRecord = totalItems > 0 ? startIndex + 1 : 0;
  const endRecord = Math.min(startIndex + itemsPerPage, totalItems);

  // Get page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  // Handlers
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      role: '',
      department: '',
      gender: '',
      status: '',
      activity: '' // ✅ Clear activity filter
    });
    setSearchTerm('');
    setCurrentPage(1);
  };

  const handleRefresh = () => {
    refetch();
    clearFilters();
  };

  // CREATE EMPLOYEE
  const handleCreateEmployee = async (newEmployeeData) => {
    try {
      await addNewUser({
        firstName: newEmployeeData.firstName,
        lastName: newEmployeeData.lastName,
        email: newEmployeeData.email,
        mobile: newEmployeeData.mobile,
        gender: newEmployeeData.gender,
        role: newEmployeeData.role,
        department: newEmployeeData.department,
        address: newEmployeeData.address,
        designation: newEmployeeData.designation,
        dateOfBirth: newEmployeeData.dateOfBirth,
        education: newEmployeeData.education,
        salary: newEmployeeData.salary,
        joiningDate: newEmployeeData.joiningDate,
        lastPromotionDate: newEmployeeData.lastPromotionDate,
        workLocation: newEmployeeData.workLocation,
        status: "On Duty",
        skills: newEmployeeData.skills,
        experience: newEmployeeData.experience,
        about: newEmployeeData.about,
        password: newEmployeeData.password,
        companyId: "69c393e25b8735f88830c9b7",
        isActive: true
      }).unwrap();

      setCreateModalOpen(false);
      await refetch();
    } catch (err) {
  console.log("🔥 FULL ERROR:", err);
  console.log("🔥 BACKEND MESSAGE:", err?.data || err?.response?.data);
}
  };

  // UPDATE EMPLOYEE
  const handleUpdateEmployee = async (updatedEmployee) => {
    try {
      const updatePayload = {
        id: updatedEmployee._id,
        firstName: updatedEmployee.firstName,
        lastName: updatedEmployee.lastName,
        gender: updatedEmployee.gender,
        mobile: updatedEmployee.mobile,
        email: updatedEmployee.email,
        role: updatedEmployee.role,
        department: updatedEmployee.department,
        designation: updatedEmployee.designation,
        address: updatedEmployee.address,
        dateOfBirth: updatedEmployee.dateOfBirth,
        education: updatedEmployee.education,
        salary: updatedEmployee.salary,
        status: updatedEmployee.status,
        joiningDate: updatedEmployee.joiningDate,
        lastPromotionDate: updatedEmployee.lastPromotionDate,
        workLocation: updatedEmployee.workLocation,
        skills: updatedEmployee.skills,
        
        
      };

      if (updatedEmployee.password) {
        updatePayload.password = updatedEmployee.password;
      }

      await updateUser(updatePayload).unwrap();
      await refetch();
      setUpdateModalOpen(false);
      setSelectedEmployee(null);
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  // DELETE EMPLOYEE
  const handleDeleteEmployee = async (employee) => {
    setDeleteLoading(true);
    try {
      const employeeId = employee._id || employee.id;
      if (!employeeId) throw new Error("Employee ID is missing");

      await deleteUser(employeeId).unwrap();
      await refetch();
      setSelectedEmployee(null);
    } catch (error) {
      console.error("Delete error:", error);
      throw error;
    } finally {
      setDeleteLoading(false);
    }
  };

  // Export to CSV
  const exportToExcel = () => {
    if (!filteredData.length) return;

    const exportData = filteredData.map(emp => ({
      Name: `${emp.firstName} ${emp.lastName}`,
      Role: emp.role || 'N/A',
      Department: emp.department || 'N/A',
      Mobile: emp.mobile || 'N/A',
      Email: emp.email || 'N/A',
      Gender: emp.gender || 'N/A',
      JoiningDate: emp.joiningDate || 'N/A',
      Address: emp.address || 'N/A',
      Status: emp.status || 'N/A',
      Active: emp.isActive ? "Active" : "Inactive"
    }));

    const headers = Object.keys(exportData[0]);
    const csvData = [
      headers.join(','),
      ...exportData.map(row =>
        headers.map(header => `"${row[header] || ''}"`).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `employees_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const hasActiveFilters = searchTerm !== '' || Object.values(filters).some(value => value !== '');

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border p-8">
        <div className="text-center">Loading employees...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-white rounded-lg border p-8">
        <div className="text-center text-red-600">Error loading employees. Please try again.</div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-lg border overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b">
        <h2 className="text-lg font-semibold">All Employees</h2>
      </div>

      {/* SEARCH AND ACTIONS */}
      <div className="px-6 py-4 border-b bg-gray-50">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by name, role, email..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-10 pr-10 py-2 border rounded-lg text-sm"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 border rounded-lg flex gap-2 hover:bg-gray-50"
          >
            <Filter size={16} />
            Filter
          </button>

          <button
            onClick={handleRefresh}
            className="px-4 py-2 border rounded-lg flex gap-2 hover:bg-gray-50"
          >
            <RefreshCw size={16} />
            Refresh
          </button>

          <button
            onClick={exportToExcel}
            className="px-4 py-2 border rounded-lg flex gap-2 hover:bg-gray-50"
          >
            <Download size={16} />
            Export
          </button>

          <button
            onClick={() => setCreateModalOpen(true)}
            disabled={isLoadingNewuser}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg flex gap-2 hover:bg-purple-700 transition disabled:opacity-50"
          >
            <Plus size={16} />
            Add Employee
          </button>
        </div>

        {/* FILTER PANEL WITH CUSTOM DROPDOWNS */}
        {showFilters && (
          <div className="flex gap-4 mt-4 flex-wrap items-center">
            {/* Role Custom Dropdown */}
            <div className="relative" ref={roleDropdownRef}>
              <button
                onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm flex items-center gap-2 hover:bg-gray-50 transition-colors text-gray-700"
              >
                <span>{getSelectedRoleLabel()}</span>
                <ChevronDown size={14} className={`transition-transform ${showRoleDropdown ? 'rotate-180' : ''}`} />
              </button>

              {showRoleDropdown && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
                  {roleOptions.map((option) => (
                    <button
                      key={option.value || 'all-roles'}
                      onClick={() => {
                        setFilters({ ...filters, role: option.value });
                        setShowRoleDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors ${filters.role === option.value ? 'bg-gray-100' : ''
                        }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Department Custom Dropdown */}
            <div className="relative" ref={departmentDropdownRef}>
              <button
                onClick={() => setShowDepartmentDropdown(!showDepartmentDropdown)}
                className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm flex items-center gap-2 hover:bg-gray-50 transition-colors text-gray-700"
              >
                <span>{getSelectedDepartmentLabel()}</span>
                <ChevronDown size={14} className={`transition-transform ${showDepartmentDropdown ? 'rotate-180' : ''}`} />
              </button>

              {showDepartmentDropdown && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
                  {departmentOptions.map((option) => (
                    <button
                      key={option.value || 'all-depts'}
                      onClick={() => {
                        setFilters({ ...filters, department: option.value });
                        setShowDepartmentDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors ${filters.department === option.value ? 'bg-gray-100' : ''
                        }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Gender Custom Dropdown */}
            <div className="relative" ref={genderDropdownRef}>
              <button
                onClick={() => setShowGenderDropdown(!showGenderDropdown)}
                className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm flex items-center gap-2 hover:bg-gray-50 transition-colors text-gray-700"
              >
                <span>{getSelectedGenderLabel()}</span>
                <ChevronDown size={14} className={`transition-transform ${showGenderDropdown ? 'rotate-180' : ''}`} />
              </button>

              {showGenderDropdown && (
                <div className="absolute top-full left-0 mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
                  {genderOptions.map((option) => (
                    <button
                      key={option.value || 'all-genders'}
                      onClick={() => {
                        setFilters({ ...filters, gender: option.value });
                        setShowGenderDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors ${filters.gender === option.value ? 'bg-gray-100' : ''
                        }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Status Custom Dropdown */}
            <div className="relative" ref={statusDropdownRef}>
              <button
                onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm flex items-center gap-2 hover:bg-gray-50 transition-colors text-gray-700"
              >
                <span>{getSelectedStatusLabel()}</span>
                <ChevronDown size={14} className={`transition-transform ${showStatusDropdown ? 'rotate-180' : ''}`} />
              </button>

              {showStatusDropdown && (
                <div className="absolute top-full left-0 mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
                  {statusOptions.map((option) => (
                    <button
                      key={option.value || 'all-status'}
                      onClick={() => {
                        setFilters({ ...filters, status: option.value });
                        setShowStatusDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors ${filters.status === option.value ? 'bg-gray-100' : ''
                        }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ✅ Activity Custom Dropdown */}
            <div className="relative" ref={activityDropdownRef}>
              <button
                onClick={() => setShowActivityDropdown(!showActivityDropdown)}
                className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm flex items-center gap-2 hover:bg-gray-50 transition-colors text-gray-700"
              >
                <span>{getSelectedActivityLabel()}</span>
                <ChevronDown size={14} className={`transition-transform ${showActivityDropdown ? 'rotate-180' : ''}`} />
              </button>

              {showActivityDropdown && (
                <div className="absolute top-full left-0 mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
                  {activityOptions.map((option) => (
                    <button
                      key={option.value || 'all-activities'}
                      onClick={() => {
                        setFilters({ ...filters, activity: option.value });
                        setShowActivityDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors ${filters.activity === option.value ? 'bg-gray-100' : ''
                        }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-red-600 px-3 py-2 rounded flex gap-2 items-center hover:bg-red-50 transition"
              >
                <X size={16} />
                Clear All
              </button>
            )}
          </div>
        )}
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Role</th>
              <th className="px-6 py-3 text-left">Department</th>
              <th className="px-6 py-3 text-left">Mobile</th>
              <th className="px-6 py-3 text-left">Joining Date</th>
              <th className="px-6 py-3 text-left">Email</th>
              <th className="px-6 py-3 text-left">Gender</th>
              <th className="px-6 py-3 text-left">Address</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Active</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan="11" className="text-center py-6">
                  <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
                    <span className="ml-2">Loading employees...</span>
                  </div>
                </td>
              </tr>
            )}

            {!isLoading && currentEmployees.length === 0 && (
              <tr>
                <td colSpan="11" className="text-center py-12">
                  <div className="flex flex-col items-center justify-center text-gray-500">
                    <Search size={48} className="mb-2 text-gray-300" />
                    <p className="text-lg font-medium">No employees found</p>
                    <p className="text-sm mt-1">Try adjusting your search or filters</p>
                  </div>
                </td>
              </tr>
            )}

            {!isLoading && currentEmployees.map((emp) => (
              <tr key={emp._id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium whitespace-nowrap">
                  {emp.firstName} {emp.lastName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{emp.role || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap">{emp.department || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap">{emp.mobile || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap">{emp.joiningDate || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap">{emp.email || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap">{emp.gender || '-'}</td>
                <td className="px-6 py-4 max-w-xs truncate">{emp.address || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs ${emp.status === "On Duty" ? "bg-green-100 text-green-800" :
                    emp.status === "On Leave" ? "bg-red-100 text-red-800" :
                      emp.status === "Active" ? "bg-blue-100 text-blue-800" :
                        "bg-gray-100 text-gray-800"
                    }`}>
                    {emp.status || "N/A"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${emp.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}>
                    {emp.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-6 py-4 flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedEmployee(emp);
                      setUpdateModalOpen(true);
                    }}
                    disabled={isUpdating}
                    className="text-blue-600 hover:text-blue-800 p-1 transition-colors"
                    title="Edit"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedEmployee(emp);
                      setDeleteModalOpen(true);
                    }}
                    disabled={deleteLoading}
                    className="text-red-600 hover:text-red-800 p-1 transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="px-6 py-4 border-t bg-gray-50 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Showing {startRecord} to {endRecord} of {totalItems} entries
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
          >
            <ChevronLeft size={16} />
            Previous
          </button>

          <div className="flex items-center gap-1">
            {getPageNumbers().map((page, index) =>
              page === "..." ? (
                <span key={index} className="px-2 text-gray-400">...</span>
              ) : (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-8 h-8 rounded-md text-sm ${currentPage === page
                    ? "bg-purple-600 text-white"
                    : "hover:bg-gray-200"
                    }`}
                >
                  {page}
                </button>
              )
            )}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
          >
            Next
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Modals */}
      <CreateEmployeeModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onSubmit={handleCreateEmployee}
      />
      <UpdateEmployeeModal
        open={updateModalOpen}
        onOpenChange={(val) => {
          setUpdateModalOpen(val);
          if (!val) setSelectedEmployee(null);
        }}
        employee={selectedEmployee}
        onUpdate={handleUpdateEmployee}
      />
      <DeleteEmployeeModal
        open={deleteModalOpen}
        onOpenChange={(val) => {
          setDeleteModalOpen(val);
          if (!val) setSelectedEmployee(null);
        }}
        employee={selectedEmployee}
        onConfirm={handleDeleteEmployee}
      />
    </div>
  );
};

export default Employees;