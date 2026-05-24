import type { NullableTeamRole } from "../../features/teams/types/team.type";
import type { UserRole } from "../../features/users/types/userRole";

export function resolveRoles(
  globalRole?: UserRole,
  teamRole?: NullableTeamRole,
) {
  return {
    isSuperAdmin: globalRole === "SUPER_ADMIN",
    isGlobalAdmin: globalRole === "ADMIN",
    isOwner: teamRole === "OWNER",
    isAdmin: teamRole === "ADMIN",
    isMember: teamRole === "MEMBER",
  };
}
