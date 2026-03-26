import React, { useState } from "react";
import { X, Trash2, AlertTriangle } from "lucide-react";
import { useDeleteAttendanceMutation } from "@/app/service/attendance";

const DeleteAttendance = ({
  open,
  onOpenChange,
  attendance,
  attendanceData,
  setAttendanceData,
  onSuccess
}) => {

  const [deleteAttendance] = useDeleteAttendanceMutation();
  const [loading, setLoading] = useState(false);

  // Helper function to format time with AM/PM
  const formatTime = (timeString) => {
    if (!timeString) return "-";
    
    if (timeString.includes('AM') || timeString.includes('PM')) {
      return timeString;
    }
    
    const [hours, minutes] = timeString.split(':');
    if (!hours || !minutes) return timeString;
    
    let hour = parseInt(hours);
    const minute = minutes;
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12;
    hour = hour ? hour : 12;
    const hourStr = hour.toString().padStart(2, '0');
    
    return `${hourStr}:${minute} ${ampm}`;
  };

  const handleDelete = async () => {
    if (!attendance?._id) return;

    setLoading(true);

    try {
      await deleteAttendance(attendance._id).unwrap();

      if (attendanceData && setAttendanceData) {
        const newData = attendanceData.filter(
          (item) => item._id !== attendance._id
        );
        setAttendanceData(newData);
      }

      if (onSuccess) {
        onSuccess();
      }

      onOpenChange(false);

    } catch (error) {
      console.error("Delete error:", error);
      alert(error?.data?.message || "Failed to delete attendance. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!open || !attendance) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Header with modern design */}
        <div className="relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-red-600"></div>
          <div className="pt-6 pb-2 px-6">
            <button 
              onClick={() => onOpenChange(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              disabled={loading}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pb-6">
          
          {/* Warning Icon */}
          <div className="flex justify-center mb-4">
            <div className="bg-red-50 p-3 rounded-full">
              <AlertTriangle size={32} className="text-red-500" />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-xl font-semibold text-center text-gray-900 mb-2">
            Delete Attendance Record
          </h2>
          
          {/* Description */}
          <p className="text-sm text-center text-gray-500 mb-6">
            Are you sure you want to delete this attendance record? This action cannot be undone.
          </p>

          {/* Employee Card - Modern Design */}
          <div className="bg-gray-50 rounded-xl p-5 mb-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 font-semibold text-sm">
                    {attendance?.userId?.firstName?.charAt(0)}{attendance?.userId?.lastName?.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {attendance?.userId?.firstName} {attendance?.userId?.lastName}
                  </h3>
                  <p className="text-xs text-gray-500">Employee</p>
                </div>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                attendance?.status === 'Present' ? 'bg-green-100 text-green-700' :
                attendance?.status === 'Late' ? 'bg-yellow-100 text-yellow-700' :
                attendance?.status === 'Absent' ? 'bg-red-100 text-red-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {attendance?.status}
              </div>
            </div>

            {/* Attendance Details Grid */}
            <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-200">
              <div>
                <p className="text-xs text-gray-500 mb-1">First In</p>
                <p className="text-sm font-medium text-gray-900">
                  {formatTime(attendance?.firstIn)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Last Out</p>
                <p className="text-sm font-medium text-gray-900">
                  {formatTime(attendance?.lastOut)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Total Hours</p>
                <p className="text-sm font-medium text-gray-900">
                  {attendance?.totalHours || "-"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Shift</p>
                <p className="text-sm font-medium text-gray-900">
                  {attendance?.shift}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 font-medium"
              disabled={loading}
            >
              Cancel
            </button>
            
            <button
              type="button"
              onClick={handleDelete}
              className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 font-medium"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 size={18} />
                  Delete
                </>
              )}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DeleteAttendance;