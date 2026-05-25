import type { DashboardData } from "../types/dashboard";
import { mockDashboard } from "./mockData";

export const emptyDashboard: DashboardData = {
  ...mockDashboard,
  studentName: "Student",
  todaysFocus: { lessons: [], classConnect: [], assignments: [] },
  upcomingLessons: [],
  upcomingClassConnect: [],
  upcomingAssignments: [],
  courses: [],
  liveClassConnect: null,
};
