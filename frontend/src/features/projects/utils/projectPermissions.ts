import { resolveRoles } from "../../../common/utils/roleHelpers";
import type { NullableTeamRole } from "../../teams/types/team.type";
import type { UserRole } from "../../users/types/userRole";

export interface ProjectPermissions {
  canManageProject: boolean;
  canCreateProject: boolean;
  canEditProjectDetails: boolean;
  canDeleteProject: boolean;
  canViewDeleteProject: boolean;
  canCreateTask: boolean;
}

interface Params {
  globalRole?: UserRole;
  teamRole?: NullableTeamRole;
}

export function getProjectPermissions({
  globalRole,
  teamRole,
}: Params): ProjectPermissions {
  const { isSuperAdmin, isGlobalAdmin, isOwner, isAdmin } = resolveRoles(
    globalRole,
    teamRole,
  );

  const isSystemAdmin = isSuperAdmin || isGlobalAdmin;
  const canManage = isOwner || isAdmin;

  return {
    canManageProject: isSystemAdmin || canManage,

    canCreateProject: canManage,

    canEditProjectDetails: canManage,

    canDeleteProject: canManage,

    canViewDeleteProject: isSystemAdmin || canManage,

    canCreateTask: canManage,
  };
}
