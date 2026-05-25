export type CanvasUser = {
  id: number;
  name: string;
  short_name: string;
  sortable_name: string;
  time_zone?: string;
  locale?: string;
};

export type CanvasCourse = {
  id: number;
  name: string;
  course_code: string;
  enrollments?: { last_activity_at?: string | null }[];
};

export type CanvasWebConference = {
  id: number;
  url?: string;
  join_url?: string;
};

export type CanvasCalendarEvent = {
  id: string | number;
  title: string;
  start_at: string | null;
  end_at: string | null;
  type: string;
  context_name?: string;
  html_url?: string;
  location_name?: string;
  description?: string;
  course_id?: number;
  web_conference?: CanvasWebConference;
};

export type CanvasConferenceRecording = {
  title?: string;
  playback_url?: string;
  created_at?: string;
};

export type CanvasConference = {
  id: number;
  title: string;
  description?: string;
  conference_type: string;
  duration?: number;
  started_at?: string | null;
  ended_at?: string | null;
  join_url?: string | null;
  url?: string | null;
  recordings?: CanvasConferenceRecording[] | null;
  context_name?: string;
  context_type?: string;
  context_id?: number;
};

export type CanvasPlannerItem = {
  plannable_id: string;
  plannable_type: string;
  plannable: {
    id: number;
    title: string;
    due_at?: string | null;
    course_id?: number;
    html_url?: string;
  };
  context_name: string;
  html_url?: string;
  submissions?: { submitted_at: string | null }[];
};

export type CanvasTodo = {
  type: string;
  assignment?: {
    id: number;
    name: string;
    html_url?: string;
    due_at?: string | null;
    course_id?: number;
  };
  context_name?: string;
  ignore: string;
  html_url?: string;
};
