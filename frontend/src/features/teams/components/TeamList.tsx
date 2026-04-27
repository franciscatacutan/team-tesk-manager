import {
  Pagination,
  type PaginationProps,
} from "@/common/components/pagination/Pagination";
import { Plus } from "lucide-react";
import type { Team } from "../types/team.type";
import type { TeamPermissions } from "../utils/teamPermissions";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/common/utils/dateFormatter";

interface Props {
  teams: Team[];
  isLoading: boolean;
  openTeam: (teamId: string) => void;
  setOpen: (open: boolean) => void;
  pagination: PaginationProps;
  permissions: TeamPermissions;
  onFieldChange: (field: string) => void;
  onToggleOrder: () => void;
}

export default function TeamList({
  teams,
  isLoading,
  openTeam,
  setOpen,
  pagination,
  permissions,
  onFieldChange,
  onToggleOrder,
}: Props) {
  function handleSort(field: string) {
    onFieldChange(field);
    onToggleOrder();
  }

  return (
    <>
      {isLoading ? (
        <div className="h-44 animate-pulse rounded-2xl border border-border/60 bg-muted/25" />
      ) : teams.length > 0 ? (
        <div className=" flex flex-col h-full min-h-0 p-4 rounded-xl border border-border/60 bg-background/70">
          <div className="flex-1 min-h-0 overflow-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-background z-10">
                <TableRow>
                  <TableHead
                    className="cursor-pointer select-none"
                    onClick={() => handleSort("name")}
                  >
                    Name
                  </TableHead>

                  <TableHead
                    className="cursor-pointer select-none"
                    onClick={() => handleSort("createdAt")}
                  >
                    Created Date
                  </TableHead>

                  <TableHead
                    className="cursor-pointer select-none"
                    onClick={() => handleSort("lastActivityAt")}
                  >
                    Last Activity
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {teams.map((team) => (
                  <TableRow
                    key={team.id}
                    onClick={() => openTeam(team.id)}
                    className="cursor-pointer hover:bg-muted/50"
                  >
                    <TableCell className="max-w-40">
                      <div className="font-medium truncate">{team.name}</div>
                    </TableCell>
                    <TableCell>{formatDate(team.createdAt)}</TableCell>

                    <TableCell>{formatDate(team.lastActivityAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {pagination.totalPages > 1 && (
            <Pagination
              page={pagination.page}
              size={pagination.size}
              totalPages={pagination.totalPages}
              totalElements={pagination.totalElements}
              onPageChange={pagination.onPageChange}
              onSizeChange={(size) => {
                pagination.onPageChange(0);
                pagination.onSizeChange(size);
              }}
            />
          )}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border/70 bg-background/75 px-6 py-16 text-center">
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
