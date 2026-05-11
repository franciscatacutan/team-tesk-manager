import { resolveRoles } from "../../../common/utils/roleHelpers";
import type { UserRole } from "../../users/types/userRole";
import type { NullableTeamRole } from "../types/team.type";

export interface TeamPermissions {
  canAccessTeam: boolean;
  canCreateTeam: boolean;
  canEditTeamDetails: boolean;
  canDeleteTeam: boolean;
  canViewDeleteTeam: boolean;
  canTransferOwnership: boolean;
  canChangeRole: boolean;
  canAddMember: boolean;
  canRemoveMember: boolean;
  canCreateProject: boolean;
  canCreateTask: boolean;
}

interface Params {
  globalRole?: UserRole;
  teamRole?: NullableTeamRole;
}

export function getTeamPermissions({
  globalRole,
  teamRole,
}: Params): TeamPermissions {
  const { isSuperAdmin, isGlobalAdmin, isOwner, isAdmin } = resolveRoles(
    globalRole,
    teamRole,
  );

  const isSystemAdmin = isSuperAdmin || isGlobalAdmin;
  const canManage = isOwner || isAdmin;

  return {
    canAccessTeam: isSystemAdmin || canManage,

    canCreateTeam: isSuperAdmin,

    canEditTeamDetails: isSystemAdmin,

    canDeleteTeam: isSuperAdmin,

    canViewDeleteTeam: isSystemAdmin || canManage,

    canTransferOwnership: isOwner && isSystemAdmin,

    canChangeRole: isOwner,

    canAddMember: canManage,

    canRemoveMember: canManage,

    canCreateProject: canManage,

    canCreateTask: canManage,
  };
}
