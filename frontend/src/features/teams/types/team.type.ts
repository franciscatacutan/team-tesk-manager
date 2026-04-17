import type { UserRole } from "../../users/types/userRole";
import type {
  ActivityDetails,
  ActivityType,
} from "../../../common/types/activity.types";

export interface Team {
  id: string;
  name: string;
  description?: string;
  owner?: User;
  createdAt: string;
  updatedAt: string;
  lastActivityAt: string;
}

export interface AddMembersInput {
  members: { userId: string; role: "ADMIN" | "MEMBER" }[];
}

export interface RemoveMembersInput {
  userIds: string[];
}

export interface UpdateTeamInput {
  name?: string;
  description?: string;
}

export interface TeamMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  teamRole: NullableTeamRole;
  globalRole: UserRole;
  joinedAt: string;
}

type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
};

type Project = {
  id: string;
  title: string;
};

type Task = {
  id: string;
  title: string;
};

export type TeamActivity = {
  id: string;
  message: string;
  type: ActivityType;
  details: ActivityDetails;
  user: User;
  project?: Project | null;
  task?: Task | null;
  createdAt: string;
};

export interface TeamMe {
  userId: string;
  role: NullableTeamRole;
}

export type NullableTeamRole = "OWNER" | "ADMIN" | "MEMBER" | null;

export type TeamRole = "OWNER" | "ADMIN" | "MEMBER";
