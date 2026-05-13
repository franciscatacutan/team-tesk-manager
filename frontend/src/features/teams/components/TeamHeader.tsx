import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import EditableField from "../../../common/components/EditableField";
import { useUpdateTeam } from "../hooks/useUpdateTeam";
import type { TeamPermissions } from "../utils/teamPermissions";
import { DeleteTeam } from "./DeleteTeamModal";
import type { Team } from "../types/team.type";
import { formatDate } from "@/common/utils/dateFormatter";

interface Props {
  teamId: string;
  isLoading: boolean;
  team: Team;
  permissions: TeamPermissions;
}

export default function TeamHeader({
  teamId,
  isLoading,
  team,
  permissions,
}: Props) {
  const updateTeam = useUpdateTeam(teamId);

  return (
    <>
      {isLoading ? (
        <header className="rounded-2xl border border-border/60 bg-background/95 p-4 shadow-sm">
          <div className="flex items-start justify-between gap-6">
            <div className="flex-1 space-y-3">
              <div className="h-8 w-72 animate-pulse rounded-md bg-muted" />
              <div className="h-4 w-full max-w-xl animate-pulse rounded-md bg-muted" />
              <div className="h-4 w-2/3 max-w-md animate-pulse rounded-md bg-muted" />
            </div>

            <div className="h-10 w-28 animate-pulse rounded-xl bg-muted" />
          </div>
        </header>
      ) : (
        <header className="rounded-2xl border border-border/60 bg-background/95 p-6 shadow-sm shadow-slate-900/5">
          <div className="relative flex flex-col gap-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0 flex-1">
                <div className="mb-5 flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center rounded-full border border-border/70 bg-muted/25 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    Team Workspace
                  </span>
                </div>

                <EditableField
                  displayClassName="w-full text-xl font-semibold leading-[1] tracking-[-0.07em] text-foreground sm:text-2xl"
                  inputClassName=" w-full text-xl font-semibold tracking-[-0.07em] sm:text-2xl"
                  value={team.name}
                  maxLength={100}
                  onSave={(value) => updateTeam.mutate({ name: value })}
                  disabled={!permissions.canEditTeamDetails}
                />

                <EditableField
                  displayClassName="w-full text-sm leading-7 text-muted-foreground "
                  inputClassName="w-full text-sm"
                  placeholder="Add a concise project summary or goal"
                  multiline
                  value={team.description}
                  maxLength={2000}
                  onSave={(value) => updateTeam.mutate({ description: value })}
                  disabled={!permissions.canEditTeamDetails}
                />
              </div>

              <div className="flex shrink-0 items-center gap-3 pt-1">
                {permissions.canDeleteTeam && (
                  <DeleteTeam teamId={team.id} teamName={team.name || ""} />
                )}
              </div>
            </div>

            <div className="flex flex-col gap-5 border-t border-border/50 pt-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8 border border-border/60">
                  <AvatarFallback className="text-xs font-medium">
                    {team.owner?.firstName?.[0]}
                    {team.owner?.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                    Owner
                  </p>

                  <p className="truncate text-sm font-semibold text-foreground">
                    {team.owner?.firstName} {team.owner?.lastName}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center sm:text-center gap-x-8 gap-y-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                    Created
                  </p>

                  <p className="mt-1 text-sm font-medium text-foreground">
                    {formatDate(team.createdAt)}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                    Last Activity
                  </p>

                  <p className="mt-1 text-sm font-medium text-foreground">
                    {formatDate(team.lastActivityAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>
      )}
    </>
  );
}
