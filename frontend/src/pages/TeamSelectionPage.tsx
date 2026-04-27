import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Kanban, LayoutList, Plus, Sparkles } from "lucide-react";

import { useTeams } from "../features/teams/hooks/useTeams";
import { useDebounce } from "../common/hooks/useDebounce";

import { Button } from "../components/ui/button";

import { CreateTeamModal } from "../features/teams/components/CreateTeamModal";
import {
  DELETED_FILTER,
  type DeletedFilter,
} from "../common/types/deletedFilter.types";
import { getTeamPermissions } from "../features/teams/utils/teamPermissions";
import { getUserFromToken } from "../features/users/api/userApi";
import SearchBar from "@/common/components/SearchBar";
import { SortControl } from "@/common/components/SortControl";
import type { SortOrder, SortField } from "@/common/types/sort.types";
import { BASE_SORT_OPTIONS } from "@/common/constants/sort.constants";
import { FilterPopover } from "@/common/components/FilterPopover";
import TeamBoard from "@/features/teams/components/TeamBoard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TeamList from "@/features/teams/components/TeamList";

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

  function handleFilterChange(key: string, value: string | string[]) {
    setPage(0);

    if (key === "deletedFilter") {
      setDeletedFilter(
        (typeof value === "string" && value
          ? value
          : "ACTIVE") as DeletedFilter,
      );
    }
  }

  const openTeam = (teamId: string) => {
    navigate(`/teams/${teamId}`);
  };

  const user = getUserFromToken();

  const permissions = getTeamPermissions({
    globalRole: user?.role,
  });

  const filterValues = {
    deletedFilter,
  };

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

        <Tabs defaultValue="board" className="flex flex-col flex-1 min-h-0">
          <TabsList className="inline-flex gap-1 rounded-xl border border-border/60 bg-background/70 p-1 shadow-sm">
            <TabsTrigger
              value="list"
              className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-foreground text-muted-foreground hover:bg-muted transition-all "
            >
              <LayoutList className="h-4 w-4" />
              List
            </TabsTrigger>

            <TabsTrigger
              value="board"
              className=" flex items-center gap-2 px-3 py-1.5 text-sm rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-foreground text-muted-foreground hover:bg-muted transition-all "
            >
              <Kanban className="h-4 w-4" />
              Board
            </TabsTrigger>
          </TabsList>
          <div className="flex flex-col flex-1 min-h-0">
            <TabsContent
              value="board"
              className="flex flex-col flex-1 min-h-0 gap-3"
            >
              <TeamBoard
                teams={teams}
                isLoading={isLoading}
                openTeam={openTeam}
                setOpen={setOpen}
                pagination={{
                  page,
                  size,
                  totalPages,
                  totalElements,
                  onPageChange: setPage,
                  onSizeChange: (size) => {
                    setPage(0);
                    setSize(size);
                  },
                }}
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
                pagination={{
                  page,
                  size,
                  totalPages,
                  totalElements,
                  onPageChange: setPage,
                  onSizeChange: (size) => {
                    setPage(0);
                    setSize(size);
                  },
                }}
                permissions={permissions}
                onFieldChange={handleSortField}
                onToggleOrder={handleSortOrder}
              />
            </TabsContent>
          </div>
        </Tabs>
      </div>

      <CreateTeamModal open={open} onOpenChange={setOpen} />
    </div>
  );
}
