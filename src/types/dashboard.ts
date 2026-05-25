export type ClickableItem = {
  id: string;
  title: string;
  href: string;
};

export type TodaysFocus = {
  lessons: ClickableItem[];
  classConnect: ClickableItem[];
  assignments: ClickableItem[];
};

export type UpcomingLesson = ClickableItem & { due: string };

export type UpcomingClassConnect = ClickableItem & {
  teacher: string;
  time: string;
  date: string;
  joinHref?: string;
  conferenceType?: string;
  isLive?: boolean;
};

export type UpcomingAssignment = ClickableItem & {
  badge: string | null;
};

export type Course = ClickableItem & {
  lastLogin: string;
  nextActivity: string;
  nextActivityHref?: string;
};

export type QuickLink = ClickableItem & {
  variant: "library" | "zone";
};

export type ConferenceRecording = {
  title: string;
  href: string;
};

export type LiveClassConnect = {
  title: string;
  subtitle: string;
  courseName?: string;
  href: string;
  joinHref: string;
  conferenceType: string;
  isLive: boolean;
  time?: string;
  hasRecording: boolean;
  recordings: ConferenceRecording[];
} | null;

export type DashboardData = {
  studentName: string;
  timeZone?: string;
  todaysFocus: TodaysFocus;
  upcomingLessons: UpcomingLesson[];
  upcomingClassConnect: UpcomingClassConnect[];
  upcomingAssignments: UpcomingAssignment[];
  quickLinks: QuickLink[];
  courses: Course[];
  liveClassConnect: LiveClassConnect;
};

export type DataSource = "mock" | "canvas";
