import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const attendanceApi = createApi({
  reducerPath: "attendance",

  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL
  }),

  endpoints: (builder) => ({

    // GET ALL ATTENDANCE
    getAttendance: builder.query({
  query: (companyId) => `/api/attendance?companyId=${companyId}`,
}),
    // GET SINGLE ATTENDANCE
    getSingleAttendance: builder.query({
      query: (id) => `/api/attendance/${id}`,
    }),

    // CREATE ATTENDANCE
    addAttendance: builder.mutation({
      query: (newAttendance) => ({
        url: `/api/attendance`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: newAttendance,
      }),
    }),

    // UPDATE ATTENDANCE
    updateAttendance: builder.mutation({
      query: ({ id, updateAttendance }) => ({
        url: `/api/attendance/${id}`,
        method: "PUT",
        body: updateAttendance,
      }),
    }),

    // DELETE ATTENDANCE
    deleteAttendance: builder.mutation({
      query: (id) => ({
        url: `/api/attendance/${id}`,
        method: "DELETE",
      }),
    }),

  }),
});

export const {
  useGetAttendanceQuery,
  useGetSingleAttendanceQuery,
  useAddAttendanceMutation,
  useDeleteAttendanceMutation,
  useUpdateAttendanceMutation
} = attendanceApi;