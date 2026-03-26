import React, { useState, useEffect } from "react";
import { X, AlertCircle } from "lucide-react";
import { useUpdateAttendanceMutation } from "@/app/service/attendance";

const UpdateAttendance = ({
  open,
  onOpenChange,
  attendance,
  attendanceData,
  setAttendanceData,
  onSuccess
}) => {

  const [updateAttendance] = useUpdateAttendanceMutation();

  const [formData, setFormData] = useState({
    firstIn: "",
    lastOut: "",
    totalHours: "",
    status: "",
    shift: ""
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const [statusOpen, setStatusOpen] = useState(false);
  const [shiftOpen, setShiftOpen] = useState(false);

  const formatTimeInput = (timeString) => {
    if (!timeString) return "";

    if (timeString.includes("AM") || timeString.includes("PM")) {
      const [time, modifier] = timeString.split(" ");
      let [hours, minutes] = time.split(":");

      if (modifier === "PM" && hours !== "12") {
        hours = String(parseInt(hours) + 12);
      }
      if (modifier === "AM" && hours === "12") {
        hours = "00";
      }

      return `${hours.padStart(2, "0")}:${minutes}`;
    }

    return timeString;
  };

  const displayTimeWithAMPM = (timeString) => {
    if (!timeString) return "";

    if (timeString.includes("AM") || timeString.includes("PM")) {
      return timeString;
    }

    const [hours, minutes] = timeString.split(":");
    if (!hours || !minutes) return timeString;

    let hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12;
    hour = hour ? hour : 12;

    return `${hour.toString().padStart(2, "0")}:${minutes} ${ampm}`;
  };

  useEffect(() => {
    if (!attendance) return;

    setFormData({
      firstIn: displayTimeWithAMPM(attendance.firstIn || ""),
      lastOut: displayTimeWithAMPM(attendance.lastOut || ""),
      totalHours: attendance.totalHours || "",
      status: attendance.status || "",
      shift: attendance.shift || ""
    });

    setErrors({});
  }, [attendance]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstIn) {
      newErrors.firstIn = "First In time is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!attendance?._id) return;
    if (!validateForm()) return;

    setLoading(true);

    try {
      const updateData = {
        ...formData,
        firstIn: formatTimeInput(formData.firstIn),
        lastOut: formatTimeInput(formData.lastOut)
      };

      const response = await updateAttendance({
        id: attendance._id,
        updateAttendance: updateData
      }).unwrap();

      const updatedAttendance = response?.data;

      if (attendanceData && setAttendanceData) {
        const newData = attendanceData.map((item) =>
          item._id === updatedAttendance._id ? updatedAttendance : item
        );
        setAttendanceData(newData);
      }

      if (onSuccess) onSuccess();

      onOpenChange(false);

    } catch (error) {
      setErrors({
        submit:
          error?.data?.message ||
          "Failed to update attendance. Please try again."
      });
    } finally {
      setLoading(false);
    }
  };

  if (!open || !attendance) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/20 z-50">
      <div className="bg-white w-[600px] rounded-lg shadow-xl">

        {/* Header */}
        <div className="bg-purple-600 text-white p-4 flex justify-between items-center rounded-t-lg">
          <h2 className="text-lg font-semibold">Update Attendance</h2>
          <button
            onClick={() => onOpenChange(false)}
            className="hover:bg-purple-700 p-1 rounded"
            disabled={loading}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">

          {/* Employee - Readonly */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Employee
            </label>
            <input
              disabled
              value={`${attendance?.userId?.firstName || ""} ${attendance?.userId?.lastName || ""}`}
              className="w-full border border-gray-300 px-4 py-2.5 rounded-lg bg-gray-50 text-gray-600"
            />
          </div>

          {/* First In */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First In *
            </label>
            <input
              type="text"
              name="firstIn"
              value={formData.firstIn}
              onChange={handleChange}
              placeholder="HH:MM AM/PM"
              className={`w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-purple-500 focus:outline-none ${
                errors.firstIn ? "border-red-500" : "border-gray-300"
              }`}
              disabled={loading}
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
              value={formData.lastOut}
              onChange={handleChange}
              placeholder="HH:MM AM/PM"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-purple-500 focus:outline-none"
              disabled={loading}
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
              value={formData.totalHours}
              onChange={handleChange}
              placeholder="e.g., 8h or 7.5"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-purple-500 focus:outline-none"
              disabled={loading}
            />
          </div>

          {/* STATUS CUSTOM DROPDOWN */}
          <div className="relative z-50">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>

            <div
              onClick={() => !loading && setStatusOpen(!statusOpen)}
              className={`w-full border border-gray-300 rounded-lg px-4 py-2.5 flex justify-between items-center cursor-pointer bg-white ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <span className={formData.status ? "text-gray-900" : "text-gray-500"}>
                {formData.status || "Select Status"}
              </span>
              <span className="text-gray-500">▼</span>
            </div>

            {statusOpen && !loading && (
              <div className="absolute left-0 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1 z-50 overflow-hidden">
                {["Present", "Late", "Absent", "Half Day"].map((item) => (
                  <div
                    key={item}
                    onClick={() => {
                      setFormData({ ...formData, status: item });
                      setStatusOpen(false);
                      if (errors.status) {
                        setErrors((prev) => ({ ...prev, status: "" }));
                      }
                    }}
                    className={`px-4 py-2 cursor-pointer hover:bg-gray-100 flex justify-between items-center transition-colors ${
                      formData.status === item ? "bg-gray-100" : "bg-white"
                    }`}
                  >
                    <span>{item}</span>
                    {formData.status === item && (
                      <span className="text-gray-900">✓</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SHIFT CUSTOM DROPDOWN */}
          <div className="relative z-40">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Shift
            </label>

            <div
              onClick={() => !loading && setShiftOpen(!shiftOpen)}
              className={`w-full border border-gray-300 rounded-lg px-4 py-2.5 flex justify-between items-center cursor-pointer bg-white ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <span className={formData.shift ? "text-gray-900" : "text-gray-500"}>
                {formData.shift || "Select Shift"}
              </span>
              <span className="text-gray-500">▼</span>
            </div>

            {shiftOpen && !loading && (
              <div className="absolute left-0 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1 z-40 overflow-hidden">
                {["General", "Day Shift", "Night Shift"].map((item) => (
                  <div
                    key={item}
                    onClick={() => {
                      setFormData({ ...formData, shift: item });
                      setShiftOpen(false);
                      if (errors.shift) {
                        setErrors((prev) => ({ ...prev, shift: "" }));
                      }
                    }}
                    className={`px-4 py-2 cursor-pointer hover:bg-gray-100 flex justify-between items-center transition-colors ${
                      formData.shift === item ? "bg-gray-100" : "bg-white"
                    }`}
                  >
                    <span>{item}</span>
                    {formData.shift === item && (
                      <span className="text-gray-900">✓</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <AlertCircle size={14} className="text-red-600" />
                <p className="text-sm text-red-600">{errors.submit}</p>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Updating...
                </>
              ) : (
                "Update"
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default UpdateAttendance;