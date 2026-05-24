export type ActivityType =
  | "TEAM_CREATED"
  | "TASK_CREATED"
  | "PROJECT_CREATED"
  | "TEAM_MEMBER_ADDED"
  | "TEAM_MEMBER_REMOVED"
  | "TEAM_MEMBER_ROLE_CHANGED"
  | "TEAM_OWNERSHIP_TRANSFERRED"
  | "PROJECT_STATUS_CHANGED"
  | "TASK_UPDATED"
  | "TASK_DELETED"
  | "TASK_STATUS_CHANGED"
  | "TASK_ASSIGNEE_CHANGED"
  | "TASK_SUPPORT_ASSIGNED"
  | "TASK_SUPPORT_CHANGED"
  | "TASK_SUPPORT_REMOVED"
  | "TASK_COMMENTED"
  | "PROJECT_DELETED"
  | "TEAM_DELETED"
  | "PROJECT_UPDATED"
  | "TEAM_UPDATED";

export interface ActivityChange {
  field: string;
  label: string | null;
  from: string | null;
  to: string | null;
}

export interface ActivityReference {
  id: string;
  label: string;
}

export interface ActivityDetails {
  fields: string[];
  from: string | null;
  to: string | null;
  target: string | null;
  changes?: ActivityChange[];
  team?: ActivityReference | null;
  project?: ActivityReference | null;
  task?: ActivityReference | null;
  subjectUser?: ActivityReference | null;
}
