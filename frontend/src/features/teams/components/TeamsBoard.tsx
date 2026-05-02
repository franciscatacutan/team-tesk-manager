import { Plus } from "lucide-react";
import TeamCard from "./TeamCard";
import { Button } from "@/components/ui/button";
import type { Team } from "../types/team.type";
import type { TeamPermissions } from "../utils/teamPermissions";

interface Props {
  teams: Team[];
  isLoading: boolean;
  openTeam: (teamId: string) => void;
  setOpen: (open: boolean) => void;
  permissions: TeamPermissions;
}

export default function TeamsBoard({
  teams,
  isLoading,
  openTeam,
  setOpen,
  permissions,
}: Props) {
  return (
    <>
      {isLoading ? (
        <div className="overflow-hidden p-4 rounded-2xl border border-border/60 bg-background shadow-sm">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 12 }).map((_, index) => (
              <div
                key={index}
                className="h-44 animate-pulse rounded-2xl border border-border/60 bg-muted/25"
              />
            ))}
          </div>
        </div>
      ) : teams.length > 0 ? (
        <div className="flex-1 overflow-y-auto p-4 rounded-2xl border border-border/60 bg-background shadow-sm">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {teams.map((team) => (
              <TeamCard
                key={team.id}
                team={team}
                onClick={() => openTeam(team.id)}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-border/70 bg-background/75 px-6 py-16 text-center">
          <h2 className="text-lg font-semibold text-foreground">
            No teams found
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            Try changing the search or filters, or create a new team to get
            started.
          </p>
          {permissions.canCreateTeam && (
            <Button className="mt-5 rounded-xl" onClick={() => setOpen(true)}>
              <Plus className="h-4 w-4" />
              Create team
            </Button>
          )}
        </div>
      )}
    </>
  );
}
