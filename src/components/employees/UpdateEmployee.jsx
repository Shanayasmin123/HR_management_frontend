// components/UpdateDepartmentModal.jsx
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const UpdateDepartmentModal = ({ open, onOpenChange, department, onUpdate }) => {
  const [formData, setFormData] = useState({
    department: '',
    headOfDepartment: '',
    phone: '',
    email: '',
    establishedYear: '',
    employeeCapacity: '',
    totalEmployees: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open && department) {
      setFormData({
        department: department.department || '',
        headOfDepartment: department.headOfDepartment || '',
        phone: department.phone || '',
        email: department.email || '',
        establishedYear: department.establishedYear || '',
        employeeCapacity: department.employeeCapacity || '',
        totalEmployees: department.totalEmployees || ''
      });
      setErrors({});
    }
  }, [open, department]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.department.trim()) newErrors.department = 'Department name is required';
    if (!formData.headOfDepartment.trim()) newErrors.headOfDepartment = 'Head of department is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.establishedYear) newErrors.establishedYear = 'Established year is required';
    else if (formData.establishedYear < 1900 || formData.establishedYear > new Date().getFullYear()) 
      newErrors.establishedYear = 'Year must be between 1900 and current year';
    if (!formData.employeeCapacity) newErrors.employeeCapacity = 'Employee capacity is required';
    else if (formData.employeeCapacity <= 0) newErrors.employeeCapacity = 'Capacity must be positive';
    if (!formData.totalEmployees && formData.totalEmployees !== 0) newErrors.totalEmployees = 'Total employees is required';
    else if (formData.totalEmployees < 0) newErrors.totalEmployees = 'Total employees cannot be negative';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onUpdate({ ...department, ...formData });
      onOpenChange(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0  bg-opacity-50 transition-opacity" onClick={() => onOpenChange(false)}></div>
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Update Department</h2>
            <p className="text-sm text-gray-500 mt-1">Edit the department details below.</p>
          </div>
          <button onClick={() => onOpenChange(false)} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department*</label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                placeholder="e.g., Computer Science"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  errors.department ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.department && <p className="mt-1 text-xs text-red-500">{errors.department}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Head Of Department*</label>
              <input
                type="text"
                name="headOfDepartment"
                value={formData.headOfDepartment}
                onChange={handleChange}
                placeholder="Full name"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  errors.headOfDepartment ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.headOfDepartment && <p className="mt-1 text-xs text-red-500">{errors.headOfDepartment}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone*</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 234 567 890"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  errors.phone ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email*</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="dept@example.com"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Established Year*</label>
              <input
                type="number"
                name="establishedYear"
                value={formData.establishedYear}
                onChange={handleChange}
                placeholder="e.g., 2005"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  errors.establishedYear ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.establishedYear && <p className="mt-1 text-xs text-red-500">{errors.establishedYear}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Employee Capacity*</label>
              <input
                type="number"
                name="employeeCapacity"
                value={formData.employeeCapacity}
                onChange={handleChange}
                placeholder="Max employees"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  errors.employeeCapacity ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.employeeCapacity && <p className="mt-1 text-xs text-red-500">{errors.employeeCapacity}</p>}
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Total Employees*</label>
              <input
                type="number"
                name="totalEmployees"
                value={formData.totalEmployees}
                onChange={handleChange}
                placeholder="Current count"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  errors.totalEmployees ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.totalEmployees && <p className="mt-1 text-xs text-red-500">{errors.totalEmployees}</p>}
            </div>
          </div>
          
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
            >
              Update Department
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateDepartmentModal;