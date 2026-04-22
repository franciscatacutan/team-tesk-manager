import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Sparkles } from "lucide-react";

import { useTeams } from "../features/teams/hooks/useTeams";
import { useDebounce } from "../common/hooks/useDebounce";

import { Button } from "../components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

import { CreateTeamModal } from "../features/teams/components/CreateTeamModal";
import type { DeletedFilter } from "../common/types/deletedFilter.types";
import TeamCard from "../features/teams/components/TeamCard";
import { getTeamPermissions } from "../features/teams/utils/teamPermissions";
import { getUserFromToken } from "../features/users/api/userApi";
import { Pagination } from "../common/components/pagination/Pagination";
import SearchBar from "@/common/components/SearchBar";
import { SortControl } from "@/common/components/SortControl";
import type { SortOrder, SortField } from "@/common/types/sort.types";
import { BASE_SORT_OPTIONS } from "@/common/constants/sortOptions";

export default function TeamSelectionPage() {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const [page, setPage] = useState(0);
  const [size, setSize] = useState(12);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const sort = `${sortField},${sortOrder}`;

  const [deletedFilter, setDeletedFilter] = useState<DeletedFilter>("ACTIVE");

  const debouncedSearch = useDebounce(search, 400);

  const { data, isLoading } = useTeams({
    page,
    size,
    search: debouncedSearch,
    sort,
    deletedFilter,
  });

  const teams = data?.content ?? [];
  const totalPages = data?.totalPages ?? 0;
  const totalElements = data?.totalElements ?? 0;

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(0);
  };

  const handleSortField = (value: string) => {
    setSortField(value as SortField);
    setPage(0);
  };

  const handleSortOrder = () => {
    setSortOrder((value) => (value === "asc" ? "desc" : "asc"));
    setPage(0);
  };

  const handleDeletedFilterChange = (value: DeletedFilter) => {
    setDeletedFilter(value);
    setPage(0);
  };

  const openTeam = (teamId: string) => {
    navigate(`/teams/${teamId}`);
  };

  const user = getUserFromToken();

  const permissions = getTeamPermissions({
    globalRole: user?.role,
  });

  return (
    <div className="min-h-0 h-full bg-muted/10 px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-1 flex-col h-full mx-auto max-w-7xl gap-6">
        <section className="rounded-3xl border border-border/60 bg-linear-to-br from-background via-background to-muted/20 p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5" />
                Workspace selection
              </div>
              <div className="space-y-1">
                <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                  Choose a team
                </h1>
                <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
                  Open an existing workspace or create a new team to start
                  organizing projects, members, and activity.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="rounded-2xl border border-border/60 bg-background/80 px-4 py-3 shadow-xs">
                <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  Teams
                </div>
                <div className="text-xl font-semibold tracking-tight text-foreground">
                  {totalElements}
                </div>
              </div>
              {permissions.canCreateTeam && (
                <Button className="rounded-xl" onClick={() => setOpen(true)}>
                  <Plus className="h-4 w-4" />
                  Create team
                </Button>
              )}
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-border/60 bg-background/92 p-4 shadow-sm">
          <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
            <SearchBar search={search} searchChange={handleSearchChange} />

            <div className="grid gap-2 sm:grid-cols-2 lg:min-w-88">
              {permissions.canViewDeleteTeam && (
                <div className="space-y-1">
                  <label className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                    Visibility
                  </label>
                  <Select
                    value={deletedFilter}
                    onValueChange={handleDeletedFilterChange}
                  >
                    <SelectTrigger className="h-10 rounded-xl border-border/70 bg-background shadow-none">
                      <SelectValue placeholder="Visibility" />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="ACTIVE">Active</SelectItem>
                      <SelectItem value="DELETED">Deleted</SelectItem>
                      <SelectItem value="ALL">All</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                  Sort
                </label>
                <SortControl
                  field={sortField}
                  order={sortOrder}
                  options={BASE_SORT_OPTIONS}
                  onFieldChange={handleSortField}
                  onToggleOrder={handleSortOrder}
                />
              </div>
            </div>
          </div>
        </section>

        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-44 animate-pulse rounded-2xl border border-border/60 bg-muted/25"
              />
            ))}
          </div>
        ) : teams.length > 0 ? (
          <div className="flex flex-col h-full min-h-0">
            <div className="flex-1 overflow-y-auto p-1">
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {teams.map((team) => (
                  <TeamCard
                    key={team.id}
                    team={team}
                    onClick={() => openTeam(team.id)}
                  />
                ))}
              </div>
            </div>

            {totalPages > 1 && (
              <Pagination
                page={page}
                size={size}
                totalPages={totalPages}
                totalElements={totalElements}
                onPageChange={setPage}
                onSizeChange={(size) => {
                  setPage(0);
                  setSize(size);
                }}
                options={[12, 24, 36]}
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
            {permissions.canViewDeleteTeam && (
              <Button className="mt-5 rounded-xl" onClick={() => setOpen(true)}>
                <Plus className="h-4 w-4" />
                Create team
              </Button>
            )}
          </div>
        )}
      </div>

      <CreateTeamModal open={open} onOpenChange={setOpen} />
    </div>
  );
}
