import type { UserRole } from "../../features/users/types/userRole";

export function getBasePermissions(globalRole?: UserRole) {
  const isSuperAdmin = globalRole === "SUPER_ADMIN";
  const isGlobalAdmin = globalRole === "ADMIN";

  return {
    canManageSystem: isSuperAdmin,
    canManageTeams: isSuperAdmin || isGlobalAdmin,
    canManageUsers: isSuperAdmin || isGlobalAdmin,
    canManageAdmins: isSuperAdmin,
  };
}
