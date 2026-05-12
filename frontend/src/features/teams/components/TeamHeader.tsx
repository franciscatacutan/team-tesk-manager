import type { ReactNode } from "react";

import EditableField from "../../../common/components/EditableField";
import { useUpdateTeam } from "../hooks/useUpdateTeam";
import type { TeamPermissions } from "../utils/teamPermissions";
import { DeleteTeam } from "./DeleteTeamModal";
import { cn } from "../../../lib/utils";

interface Props {
  teamId: string;
  isLoading: boolean;
  name?: string;
  description?: string;
  permissions: TeamPermissions;
  actions?: ReactNode;
}

export default function TeamHeader({
  teamId,
  isLoading,
  name,
  description,
  permissions,
  actions,
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
        <header className="rounded-2xl border border-border/60 bg-background/95 p-4 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex-1 space-y-1.5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Team workspace
              </p>

              <EditableField
                displayClassName="w-full text-xl font-semibold tracking-tight sm:text-2xl"
                inputClassName="w-full text-xl font-semibold sm:text-2xl"
                value={name}
                maxLength={100}
                onSave={(value) => updateTeam.mutate({ name: value })}
                disabled={!permissions.canEditTeamDetails}
              />

              <EditableField
                displayClassName="w-full max-w-3xl text-sm leading-6 text-muted-foreground"
                inputClassName="w-full text-sm"
                multiline
                value={description}
                maxLength={2000}
                onSave={(value) => updateTeam.mutate({ description: value })}
                disabled={!permissions.canEditTeamDetails}
              />
            </div>

            <div
              className={cn(
                "flex flex-wrap items-center gap-2 lg:justify-end lg:self-start",
              )}
            >
              {actions}

              {permissions.canDeleteTeam && (
                <DeleteTeam teamId={teamId} teamName={name || ""} />
              )}
            </div>
          </div>
        </header>
      )}
    </>
  );
}
