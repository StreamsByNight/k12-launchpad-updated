import type { DashboardData } from "../types/dashboard";

const base =
  import.meta.env.VITE_CANVAS_BASE_URL?.replace(/\/$/, "") ||
  "https://stridek12academy.com";

export const mockDashboard: DashboardData = {
  studentName: "Coco Gradebook",
  timeZone: "America/New_York",
  todaysFocus: {
    lessons: [
      {
        id: "1",
        title: "ELA 1 E2 - SMITH Reading Hour (Red Group)",
        href: `${base}/calendar`,
      },
    ],
    classConnect: [],
    assignments: [
      {
        id: "2",
        title: "Science: Body Systems Quiz",
        href: `${base}/#todo`,
      },
    ],
  },
  upcomingLessons: [
    {
      id: "1",
      title: "Test Event - repeat Jan 7th...",
      due: "Jan 7",
      href: `${base}/calendar`,
    },
    {
      id: "2",
      title: "02 Unit Test: Body Systems",
      due: "Jan 10",
      href: `${base}/#todo`,
    },
    {
      id: "3",
      title: "Math 5 - Fractions Practice",
      due: "Jan 12",
      href: `${base}/calendar`,
    },
    {
      id: "4",
      title: "Science Lab Report Draft",
      due: "Jan 14",
      href: `${base}/#todo`,
    },
  ],
  upcomingClassConnect: [
    {
      id: "1",
      title: "7th Grade Homeroom",
      teacher: "Ms. Johnson",
      time: "8:30 AM - 9:00 AM",
      date: "Tomorrow",
      href: `${base}/calendar`,
      joinHref: `${base}/calendar`,
      conferenceType: "BigBlueButton",
      isLive: false,
    },
    {
      id: "2",
      title: "ELA 1 E2 - Smith",
      teacher: "Mr. Smith",
      time: "10:00 AM - 10:45 AM",
      date: "Wed, Jan 24",
      href: `${base}/calendar`,
      joinHref: `${base}/calendar`,
      conferenceType: "BigBlueButton",
      isLive: true,
    },
  ],
  upcomingAssignments: [
    {
      id: "1",
      title: "AGRD20 Intro Forestry & Nat...",
      badge: "Due soon",
      href: `${base}/#todo`,
    },
    {
      id: "2",
      title: "ELA 1 E2 - Reading Response",
      badge: null,
      href: `${base}/#todo`,
    },
  ],
  quickLinks: [
    {
      id: "library",
      title: "K12 Library",
      variant: "library",
      href: "https://www.k12.com/resources/",
    },
    {
      id: "zone",
      title: "K12 Zone",
      variant: "zone",
      href: base,
    },
  ],
  liveClassConnect: {
    title: "ELA 1 E2 - SMITH Class Connect",
    subtitle: "ELA 1 E2 - Smith",
    courseName: "ELA 1 E2 - Smith",
    href: `${base}/calendar`,
    joinHref: `${base}/calendar`,
    conferenceType: "BigBlueButton",
    isLive: true,
    time: "10:00 AM - 10:45 AM",
    hasRecording: true,
    recordings: [
      { title: "Session recording - Jan 22", href: `${base}/conferences` },
    ],
  },
  courses: [
    {
      id: "1",
      name: "AGRD20 Intro Forestry & Nat...",
      href: `${base}/courses/1`,
      lastLogin: "Last login: 11 days ago",
      nextActivity: "Unit 3 Quiz",
      nextActivityHref: `${base}/courses/1/assignments/1`,
    },
    {
      id: "2",
      name: "ELA 1 E2 - Smith",
      href: `${base}/courses/2`,
      lastLogin: "Last login: 2 days ago",
      nextActivity: "Reading Hour",
      nextActivityHref: `${base}/courses/2`,
    },
    {
      id: "3",
      name: "Homeroom - Smith",
      href: `${base}/courses/3`,
      lastLogin: "Last login: 1 day ago",
      nextActivity: "Morning Meeting",
      nextActivityHref: `${base}/courses/3`,
    },
    {
      id: "4",
      name: "K12 Skills Arcade Math 5",
      href: `${base}/courses/4`,
      lastLogin: "Last login: 5 days ago",
      nextActivity: "Fractions Level 4",
      nextActivityHref: `${base}/courses/4`,
    },
    {
      id: "5",
      name: "Science 7 - Biology",
      href: `${base}/courses/5`,
      lastLogin: "Last login: 3 days ago",
      nextActivity: "Body Systems Test",
      nextActivityHref: `${base}/courses/5`,
    },
    {
      id: "6",
      name: "Social Studies 7",
      href: `${base}/courses/6`,
      lastLogin: "Last login: 8 days ago",
      nextActivity: "Chapter 4 Review",
      nextActivityHref: `${base}/courses/6`,
    },
    {
      id: "7",
      name: "Art Exploration",
      href: `${base}/courses/7`,
      lastLogin: "Last login: 14 days ago",
      nextActivity: "Portfolio Upload",
      nextActivityHref: `${base}/courses/7`,
    },
  ],
};
