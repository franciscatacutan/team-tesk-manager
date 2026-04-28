import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Kanban, LayoutList, Plus, Sparkles } from "lucide-react";

import { useTeams } from "../features/teams/hooks/useTeams";
import { useDebounce } from "../common/hooks/useDebounce";

import { Button } from "../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { CreateTeamModal } from "../features/teams/components/CreateTeamModal";
import {
  DELETED_FILTER,
  type DeletedFilter,
} from "../common/types/deletedFilter.types";

import { getTeamPermissions } from "../features/teams/utils/teamPermissions";
import { getUserFromToken } from "../features/users/api/userApi";

import SearchBar from "@/common/components/SearchBar";
import { SortControl } from "@/common/components/SortControl";
import { FilterPopover } from "@/common/components/FilterPopover";

import type { SortField, SortOrder } from "@/common/types/sort.types";
import { BASE_SORT_OPTIONS } from "@/common/constants/sort.constants";
import { TEAM_LIST_SORT_OPTIONS } from "@/features/teams/constants/team.constants";

import TeamBoard from "@/features/teams/components/TeamBoard";
import TeamList from "@/features/teams/components/TeamList";

import { Pagination } from "@/common/components/pagination/Pagination";

export default function TeamSelectionPage() {
  const navigate = useNavigate();

  // ---------------- STATE ----------------

  const [open, setOpen] = useState(false);

  const [view, setView] = useState<"board" | "list">("board");

  const getPaginationOptions = (type: "board" | "list") =>
    type === "board" ? [12, 24, 36] : [10, 20, 40];

  const [page, setPage] = useState(0);
  const [size, setSize] = useState<number>(getPaginationOptions("board")[0]);

  const [search, setSearch] = useState("");

  const [sortField, setSortField] = useState<SortField>("lastActivityAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const [deletedFilter, setDeletedFilter] = useState<DeletedFilter>("ACTIVE");

  // ---------------- DERIVED ----------------

  const debouncedSearch = useDebounce(search, 400);
  const sort = `${sortField},${sortOrder}`;

  const filterValues = {
    deletedFilter,
  };

  const sortOptions =
    view === "board" ? BASE_SORT_OPTIONS : TEAM_LIST_SORT_OPTIONS;

  // ---------------- DATA ----------------

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

  // ---------------- HANDLERS ----------------

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(0);
  };

  const handleViewChange = (value: string) => {
    const nextView = value as "board" | "list";

    setView(nextView);
    setPage(0);
    setSize(getPaginationOptions(nextView)[0]);
  };

  const handleSort = (field: SortField) => {
    setSortField((prevField) => {
      if (prevField === field) {
        setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
        return prevField;
      }

      setSortOrder("desc");
      return field;
    });

    setPage(0);
  };

  const handleFilterChange = (key: string, value: string | string[]) => {
    setPage(0);

    if (key === "deletedFilter") {
      setDeletedFilter(
        (typeof value === "string" && value
          ? value
          : "ACTIVE") as DeletedFilter,
      );
    }
  };

  const openTeam = (teamId: string) => {
    navigate(`/teams/${teamId}`);
  };

  // ---------------- PERMISSIONS ----------------

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

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-3 rounded-xl border px-4 py-2 text-sm">
                <div className="text-xl font-semibold tracking-tight text-foreground">
                  {totalElements}
                </div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  Teams
                </div>
              </div>

              {permissions.canCreateTeam && (
                <Button className="rounded-xl" onClick={() => setOpen(true)}>
                  <Plus className="h-4 w-4" />
                  Create
                </Button>
              )}
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-border/60 bg-background/92 p-4 shadow-sm">
          <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
            <SearchBar search={search} searchChange={handleSearchChange} />

            <div className="flex gap-2">
              {permissions.canViewDeleteTeam && (
                <FilterPopover
                  label="Visibility"
                  config={DELETED_FILTER}
                  values={filterValues}
                  onChange={handleFilterChange}
                  onClear={() => {
                    setDeletedFilter("ACTIVE");
                    setPage(0);
                  }}
                />
              )}
              {view === "board" && (
                <SortControl
                  field={sortField}
                  order={sortOrder}
                  options={sortOptions}
                  onFieldChange={handleSort}
                  onToggleOrder={() =>
                    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
                  }
                />
              )}
            </div>
          </div>
        </section>

        <Tabs
          value={view}
          onValueChange={handleViewChange}
          className="flex flex-col flex-1 min-h-0"
        >
          <TabsList className="inline-flex gap-1 rounded-xl border border-border/60 bg-background/70 p-1 shadow-sm">
            <TabsTrigger
              value="board"
              className=" flex items-center gap-2 px-3 py-1.5 text-sm rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-foreground text-muted-foreground hover:bg-muted transition-all "
            >
              <Kanban className="h-4 w-4" />
              Board
            </TabsTrigger>
            <TabsTrigger
              value="list"
              className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-foreground text-muted-foreground hover:bg-muted transition-all "
            >
              <LayoutList className="h-4 w-4" />
              List
            </TabsTrigger>
          </TabsList>
          <TabsContent
            value="board"
            className="flex flex-col flex-1 min-h-0 gap-3"
          >
            <TeamBoard
              teams={teams}
              isLoading={isLoading}
              openTeam={openTeam}
              setOpen={setOpen}
              permissions={permissions}
            />
          </TabsContent>

          <TabsContent
            value="list"
            className="flex flex-col flex-1 min-h-0 gap-3"
          >
            <TeamList
              teams={teams}
              isLoading={isLoading}
              openTeam={openTeam}
              setOpen={setOpen}
              sortField={sortField}
              sortOrder={sortOrder}
              onSort={handleSort}
              permissions={permissions}
            />
          </TabsContent>
        </Tabs>

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
            options={getPaginationOptions(view)}
          />
        )}
      </div>

      <CreateTeamModal open={open} onOpenChange={setOpen} />
    </div>
  );
}
