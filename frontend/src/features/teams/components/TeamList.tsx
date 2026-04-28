import { Plus } from "lucide-react";
import type { Team } from "../types/team.type";
import type { TeamPermissions } from "../utils/teamPermissions";
import type { SortField } from "@/common/types/sort.types";

import {
  TableHeader,
  TableRow,
  TableBody,
  TableCell,
  Table,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { formatDate } from "@/common/utils/dateFormatter";
import { SortHeader } from "@/common/components/SortHeader";

interface Props {
  teams: Team[];
  isLoading: boolean;
  openTeam: (teamId: string) => void;
  setOpen: (open: boolean) => void;
  permissions: TeamPermissions;

  sortField: SortField;
  sortOrder: "asc" | "desc";
  onSort: (field: SortField) => void;
}

export default function TeamList({
  teams,
  isLoading,
  openTeam,
  setOpen,
  permissions,
  sortField,
  sortOrder,
  onSort,
}: Props) {
  return (
    <>
      {isLoading ? (
        <div className="h-44 animate-pulse rounded-2xl border border-border/60 bg-muted/20" />
      ) : teams.length > 0 ? (
        <div className="flex flex-col h-full min-h-0">
          <div className="flex-1 min-h-0 overflow-auto rounded-2xl border border-border/60 bg-background shadow-sm">
            <Table>
              <TableHeader className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b">
                <TableRow className="hover:bg-transparent">
                  <SortHeader
                    label="Name"
                    field="name"
                    sortField={sortField}
                    order={sortOrder}
                    onSort={onSort}
                  />

                  <SortHeader
                    label="Owner"
                    field="owner"
                    sortField={sortField}
                    order={sortOrder}
                    onSort={onSort}
                  />

                  <SortHeader
                    label="Created"
                    field="createdAt"
                    sortField={sortField}
                    order={sortOrder}
                    onSort={onSort}
                  />

                  <SortHeader
                    label="Last Activity"
                    field="lastActivityAt"
                    sortField={sortField}
                    order={sortOrder}
                    onSort={onSort}
                  />
                </TableRow>
              </TableHeader>

              <TableBody>
                {teams.map((team) => (
                  <TableRow
                    key={team.id}
                    onClick={() => openTeam(team.id)}
                    className="group cursor-pointer transition-colors hover:bg-muted/40"
                  >
                    <TableCell className="px-4 py-3">
                      <div className="font-medium truncate group-hover:text-primary transition-colors">
                        {team.name}
                      </div>
                    </TableCell>

                    <TableCell className="px-4 py-3">
                      <div className="truncate text-muted-foreground">
                        {team.owner?.firstName} {team.owner?.lastName}
                      </div>
                    </TableCell>

                    <TableCell className="px-4 py-3 text-sm text-muted-foreground">
                      {formatDate(team.createdAt)}
                    </TableCell>

                    <TableCell className="px-4 py-3 text-sm text-muted-foreground">
                      {formatDate(team.lastActivityAt)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border/70 bg-background/75 px-6 py-16 text-center">
          <h2 className="text-lg font-semibold text-foreground">
            No teams found
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            Try adjusting your search or filters, or create a new team.
          </p>

          {permissions.canCreateTeam && (
            <Button className="mt-6 rounded-xl" onClick={() => setOpen(true)}>
              <Plus className="h-4 w-4" />
              Create team
            </Button>
          )}
        </div>
      )}
    </>
  );
}
