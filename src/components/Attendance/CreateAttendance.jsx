import React, { useState, useEffect } from "react";
import { X, AlertCircle } from "lucide-react";
import { useAddAttendanceMutation } from "@/app/service/attendance";
import { useGetAllUserQuery } from "@/app/service/user";

const CreateAttendance = ({
  open,
  onOpenChange,
  onSuccess,
  attendanceData,
  setAttendanceData
}) => {

  const { data, isLoading, error, isError } = useGetAllUserQuery();

  let employees = [];

  if (data) {
    if (data.data && Array.isArray(data.data)) {
      employees = data.data;
    } else if (Array.isArray(data)) {
      employees = data;
    } else if (data.users && Array.isArray(data.users)) {
      employees = data.users;
    }
  }

  const [addAttendance, { isLoading: isAdding }] = useAddAttendanceMutation();

  const [form, setForm] = useState({
    companyId: "",
    userId: "",
    firstIn: "",
    lastOut: "",
    totalHours: "",
    status: "Present",
    shift: "General"
  });

  const [errors, setErrors] = useState({});
  const [employeeOpen, setEmployeeOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [shiftOpen, setShiftOpen] = useState(false);

  useEffect(() => {
    if (!open) {
      setForm({
        companyId: "",
        userId: "",
        firstIn: "",
        lastOut: "",
        totalHours: "",
        status: "Present",
        shift: "General"
      });
      setErrors({});
      setEmployeeOpen(false);
      setStatusOpen(false);
      setShiftOpen(false);
    }
  }, [open]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }

    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEmployeeSelect = (employee) => {
    const employeeCompanyId = employee.companyId || employee.company?._id;
    
    setForm(prev => ({
      ...prev,
      userId: employee._id,
      companyId: employeeCompanyId || ""
    }));
    
    setEmployeeOpen(false);
    
    if (errors.userId) {
      setErrors(prev => ({ ...prev, userId: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.userId) newErrors.userId = "Please select an employee";
    if (!form.firstIn) newErrors.firstIn = "First In time is required";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const attendanceDataToSend = {
      companyId: form.companyId,
      userId: form.userId,
      firstIn: form.firstIn,
      lastOut: form.lastOut || null,
      totalHours: form.totalHours || null,
      status: form.status,
      shift: form.shift
    };

    try {
      const response = await addAttendance(attendanceDataToSend).unwrap();
      const newAttendance = response?.data;

      if (attendanceData && setAttendanceData) {
        setAttendanceData([newAttendance, ...attendanceData]);
      }

      if (onSuccess) onSuccess();

      onOpenChange(false);

    } catch (err) {
      const errorMessage =
        err?.data?.message || err?.message || "Failed to add attendance";
      setErrors({ submit: errorMessage });
    }
  };

  const getSelectedEmployeeName = () => {
    if (!form.userId) return "Select Employee";
    const selected = employees.find(emp => emp._id === form.userId);
    if (selected) {
      return selected.name || `${selected.firstName || ""} ${selected.lastName || ""}`.trim();
    }
    return "Select Employee";
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/20 z-50">
      <div className="bg-white w-[600px] rounded-lg shadow-xl">

        {/* Header */}
        <div className="bg-purple-600 text-white p-4 flex justify-between items-center rounded-t-lg">
          <h2 className="text-lg font-semibold">Create Attendance</h2>
          <button
            onClick={() => onOpenChange(false)}
            className="hover:bg-purple-700 p-1 rounded"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">

          {/* EMPLOYEE CUSTOM DROPDOWN */}
          <div className="relative z-50">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Employee *
            </label>

            <div
              onClick={() => setEmployeeOpen(!employeeOpen)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 flex justify-between items-center cursor-pointer bg-white"
            >
              <span className={form.userId ? "text-gray-900" : "text-gray-500"}>
                {getSelectedEmployeeName()}
              </span>
              <span>▼</span>
            </div>

            {employeeOpen && (
              <div className="absolute left-0 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1 z-50 max-h-60 overflow-y-auto">
                {isLoading ? (
                  <div className="px-4 py-2 text-gray-500">Loading employees...</div>
                ) : employees.length === 0 ? (
                  <div className="px-4 py-2 text-gray-500">No employees found</div>
                ) : (
                  employees.map((emp) => {
                    const empName = emp.name ||
                      `${emp.firstName || ""} ${emp.lastName || ""}`.trim();
                    return (
                      <div
                        key={emp._id}
                        onClick={() => handleEmployeeSelect(emp)}
                        className={`px-4 py-2 cursor-pointer hover:bg-gray-100 flex justify-between ${
                          form.userId === emp._id ? "bg-gray-100" : ""
                        }`}
                      >
                        {empName}
                        {form.userId === emp._id && <span>✓</span>}
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {errors.userId && (
              <div className="flex items-center gap-1 mt-1">
                <AlertCircle size={12} className="text-red-500" />
                <p className="text-xs text-red-500">{errors.userId}</p>
              </div>
            )}
          </div>

          {/* First In */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First In *
            </label>
            <input
              type="text"
              name="firstIn"
              value={form.firstIn}
              onChange={handleChange}
              placeholder="HH:MM AM/PM"
              className={`w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-purple-500 ${
                errors.firstIn ? "border-red-500" : "border-gray-300"
              }`}
            />

            {errors.firstIn && (
              <div className="flex items-center gap-1 mt-1">
                <AlertCircle size={12} className="text-red-500" />
                <p className="text-xs text-red-500">{errors.firstIn}</p>
              </div>
            )}
          </div>

          {/* Last Out */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Out
            </label>
            <input
              type="text"
              name="lastOut"
              value={form.lastOut}
              onChange={handleChange}
              placeholder="HH:MM AM/PM"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Total Hours */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Total Hours
            </label>
            <input
              type="text"
              name="totalHours"
              value={form.totalHours}
              onChange={handleChange}
              placeholder="e.g., 8h or 7.5"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* STATUS CUSTOM DROPDOWN */}
          <div className="relative z-40">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>

            <div
              onClick={() => setStatusOpen(!statusOpen)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 flex justify-between items-center cursor-pointer bg-white"
            >
              <span>{form.status || "Select Status"}</span>
              <span>▼</span>
            </div>

            {statusOpen && (
              <div className="absolute left-0 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1 z-40">
                {["Present", "Late", "Absent", "Half Day"].map((item) => (
                  <div
                    key={item}
                    onClick={() => {
                      setForm({ ...form, status: item });
                      setStatusOpen(false);
                    }}
                    className={`px-4 py-2 cursor-pointer hover:bg-gray-100 flex justify-between ${
                      form.status === item ? "bg-gray-100" : ""
                    }`}
                  >
                    {item}
                    {form.status === item && <span>✓</span>}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SHIFT CUSTOM DROPDOWN */}
          <div className="relative z-30">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Shift
            </label>

            <div
              onClick={() => setShiftOpen(!shiftOpen)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 flex justify-between items-center cursor-pointer bg-white"
            >
              <span>{form.shift || "Select Shift"}</span>
              <span>▼</span>
            </div>

            {shiftOpen && (
              <div className="absolute left-0 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1 z-30">
                {["General", "Day Shift", "Night Shift"].map((item) => (
                  <div
                    key={item}
                    onClick={() => {
                      setForm({ ...form, shift: item });
                      setShiftOpen(false);
                    }}
                    className={`px-4 py-2 cursor-pointer hover:bg-gray-100 flex justify-between ${
                      form.shift === item ? "bg-gray-100" : ""
                    }`}
                  >
                    {item}
                    {form.shift === item && <span>✓</span>}
                  </div>
                ))}
              </div>
            )}
          </div>

          {errors.submit && (
            <div className="text-red-500 text-sm">{errors.submit}</div>
          )}

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={isAdding}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isAdding}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAdding ? "Saving..." : "Save"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default CreateAttendance;