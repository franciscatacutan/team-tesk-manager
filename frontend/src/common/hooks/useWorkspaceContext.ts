import { useParams } from "react-router-dom";
import { getUserFromToken } from "../../features/users/api/userApi";
import { getTeamPermissions } from "../../features/teams/utils/teamPermissions";
import { useTeamMe } from "../../features/teams/hooks/useTeamMe";
import { useTeam } from "../../features/teams/hooks/useTeam";

export function useWorkspaceContext() {
  const { teamId, projectId } = useParams();

  const user = getUserFromToken();

  const { data: teamMe } = useTeamMe(teamId || "");
  const { data: team } = useTeam(teamId || "");

  const permissions = getTeamPermissions({
    globalRole: user?.role,
    teamRole: teamMe?.role,
    isReadOnly: Boolean(team?.deletedAt),
  });

  return {
    teamId,
    projectId,
    teamIdPresent: !!teamId,
    projectIdPresent: !!projectId,
    team,
    permissions,
  };
}
