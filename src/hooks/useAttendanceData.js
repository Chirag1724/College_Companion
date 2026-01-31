import { useState, useEffect } from "react";

/**
 * Custom hook for managing attendance data and calculations
 * Handles attendance statistics, leave history, and timeline data
 */
export function useAttendanceData() {
  const [attendanceData, setAttendanceData] = useState({
    totalClasses: 120,
    attendedClasses: 105,
    attendancePercentage: 87.5,
    requiredPercentage: 75,
    isAtRisk: false,
  });

  const [leaveHistory, setLeaveHistory] = useState([
    {
      id: 1,
      date: "2025-11-28",
      reason: "Medical Emergency",
      aiScore: 95,
      status: "approved",
    },
    {
      id: 2,
      date: "2025-11-15",
      reason: "Family Function",
      aiScore: 72,
      status: "approved",
    },
    {
      id: 3,
      date: "2025-10-30",
      reason: "Personal Work",
      aiScore: 45,
      status: "not-recommended",
    },
  ]);

  const [absenceTimeline, setAbsenceTimeline] = useState([
    { date: "2025-11-01", status: "present" },
    { date: "2025-11-02", status: "present" },
    { date: "2025-11-03", status: "absent" },
    { date: "2025-11-04", status: "present" },
    { date: "2025-11-05", status: "present" },
    { date: "2025-11-06", status: "present" },
    { date: "2025-11-07", status: "present" },
    { date: "2025-11-08", status: "absent" },
    { date: "2025-11-09", status: "present" },
    { date: "2025-11-10", status: "present" },
  ]);

  const [userConfig, setUserConfig] = useState({
    homeDistance: 25,
    isHosteller: false,
    semesterStart: "2025-08-01",
    semesterEnd: "2025-12-20",
    academicCalendar: null,
    weeklyTimetable: null,
  });

  // Calculate if attendance is at risk
  useEffect(() => {
    const { attendancePercentage, requiredPercentage } = attendanceData;
    setAttendanceData(prev => ({
      ...prev,
      isAtRisk: attendancePercentage < requiredPercentage,
    }));
  }, [attendanceData.attendancePercentage, attendanceData.requiredPercentage]);

  /**
   * Update attendance statistics
   */
  const updateAttendance = (totalClasses, attendedClasses) => {
    const percentage = totalClasses > 0
      ? Math.round((attendedClasses / totalClasses) * 100 * 10) / 10
      : 0;

    setAttendanceData(prev => ({
      ...prev,
      totalClasses,
      attendedClasses,
      attendancePercentage: percentage,
    }));
  };

  /**
   * Add a new leave entry
   */
  const addLeaveEntry = (date, reason, aiScore) => {
    const newLeave = {
      id: Date.now(),
      date,
      reason,
      aiScore,
      status: aiScore >= 70 ? "approved" : "not-recommended",
    };
    setLeaveHistory(prev => [newLeave, ...prev]);
  };

  /**
   * Update user configuration
   */
  const updateUserConfig = (config) => {
    setUserConfig(prev => ({ ...prev, ...config }));
  };

  /**
   * Upload academic calendar file
   */
  const uploadAcademicCalendar = async (file) => {
    try {
      console.log("📤 Uploading academic calendar:", file.name);

      const formData = new FormData();
      formData.append('userId', 'current-user'); // TODO: Replace with actual user ID
      formData.append('file', file);

      const backendUrl = import.meta.env.VITE_API_BASE_URL || '';
      const response = await fetch(`${backendUrl}/api/ai-attendance/upload/calendar`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Upload failed' }));
        throw new Error(errorData.error || 'Failed to upload calendar');
      }

      const data = await response.json();

      if (data.success) {
        setUserConfig(prev => ({
          ...prev,
          academicCalendar: data.data
        }));
        console.log("✅ Calendar uploaded successfully");
        return data.data;
      } else {
        throw new Error(data.error || 'Upload failed');
      }
    } catch (error) {
      console.error("❌ Calendar upload error:", error.message);
      throw error;
    }
  };

  /**
   * Upload weekly timetable
   */
  const uploadWeeklyTimetable = async (file) => {
    try {
      console.log("📤 Uploading timetable:", file.name);

      const formData = new FormData();
      formData.append('userId', 'current-user'); // TODO: Replace with actual user ID
      formData.append('file', file);

      const backendUrl = import.meta.env.VITE_API_BASE_URL || '';
      const response = await fetch(`${backendUrl}/api/ai-attendance/upload/timetable`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Upload failed' }));
        throw new Error(errorData.error || 'Failed to upload timetable');
      }

      const data = await response.json();

      if (data.success) {
        setUserConfig(prev => ({
          ...prev,
          weeklyTimetable: data.data
        }));
        console.log("✅ Timetable uploaded successfully");
        return data.data;
      } else {
        throw new Error(data.error || 'Upload failed');
      }
    } catch (error) {
      console.error("❌ Timetable upload error:", error.message);
      throw error;
    }
  };

  /**
   * Calculate classes that can be missed while maintaining minimum attendance
   */
  const calculateSafeAbsences = () => {
    const { totalClasses, attendedClasses, requiredPercentage } = attendanceData;
    const minRequired = Math.ceil((requiredPercentage / 100) * totalClasses);
    const safeAbsences = Math.max(0, attendedClasses - minRequired);
    return safeAbsences;
  };

  return {
    attendanceData,
    leaveHistory,
    absenceTimeline,
    userConfig,
    updateAttendance,
    addLeaveEntry,
    updateUserConfig,
    uploadAcademicCalendar,
    uploadWeeklyTimetable,
    calculateSafeAbsences,
  };
}
