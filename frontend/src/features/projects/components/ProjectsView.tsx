import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { useDebounce } from "../../../common/hooks/useDebounce";
import { useProjects } from "../hooks/useProjects";
import { CreateProjectModal } from "./CreateProjectModal";
import { ProjectsHeader } from "./ProjectsHeader";
import ProjectsToolbar from "./ProjectsToolBar";
import type { DeletedFilter } from "../../../common/types/deletedFilter.types";
import { useTeamMe } from "../../teams/hooks/useTeamMe";
import { getProjectPermissions } from "../utils/projectPermissions";
import { getUserFromToken } from "../../users/api/userApi";
import { Pagination } from "../../../common/components/pagination/Pagination";
import ProjectsBoard from "./ProjectsBoard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutGrid, LayoutList } from "lucide-react";
import ProjectsList from "./ProjectsList";
import type { SortField, SortOrder } from "@/common/types/sort.types";
import {
  isProjectStatus,
  PROJECT_LIST_SORT_OPTIONS,
  type ProjectStatus,
} from "../utils/project.constants";
import { BASE_SORT_OPTIONS } from "@/common/constants/sort.constants";

export default function ProjectsPage() {
  const { teamId } = useParams<{
    teamId: string;
  }>();

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

  const [statusFilter, setStatusFilter] = useState<ProjectStatus[]>([]);

  const [deletedFilter, setDeletedFilter] = useState<DeletedFilter>("ACTIVE");

  // ---------------- DERIVED ----------------

  const debouncedSearch = useDebounce(search, 400);
  const sort = `${sortField},${sortOrder}`;

  const filterValues = {
    status: statusFilter,
    deletedFilter,
  };

  const sortOptions =
    view === "board" ? BASE_SORT_OPTIONS : PROJECT_LIST_SORT_OPTIONS;

  // ---------------- DATA ----------------

  const { data, isLoading } = useProjects(teamId || "", {
    page,
    size,
    search: debouncedSearch,
    statusFilter,
    sort,
    deletedFilter,
  });

  const projects = data?.content ?? [];
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

  const handleToggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const handleFilterChange = (key: string, value: string | string[]) => {
    setPage(0);

    if (key === "statusFilter") {
      const statuses = Array.isArray(value) ? value : value ? [value] : [];
      setStatusFilter(statuses.filter(isProjectStatus));
    }

    if (key === "deletedFilter") {
      setDeletedFilter(
        (typeof value === "string" && value
          ? value
          : "ACTIVE") as DeletedFilter,
      );
    }
  };

  function openProject(projectId: string) {
    navigate(`/teams/${teamId}/projects/${projectId}`);
  }

  // ---------------- PERMISSIONS ----------------

  const user = getUserFromToken();
  const { data: teamMe } = useTeamMe(teamId || "");

  const permissions = getProjectPermissions({
    globalRole: user?.role,
    teamRole: teamMe?.role,
  });

  return (
    <div className="space-y-6 flex flex-1 flex-col min-h-0 h-full">
      <ProjectsHeader
        permissions={permissions}
        onCreateProject={() => setOpen(true)}
      />

      <CreateProjectModal
        teamId={teamId || ""}
        open={open}
        onOpenChange={setOpen}
      />

      <ProjectsToolbar
        permissions={permissions}
        search={{
          value: search,
          onChange: handleSearchChange,
        }}
        filters={{
          values: filterValues,
          onChange: handleFilterChange,
          onDeletedChange: setDeletedFilter,
        }}
        view={view}
        sort={{
          field: sortField,
          order: sortOrder,
          options: sortOptions,
          onFieldChange: handleSort,
          onToggleOrder: handleToggleSortOrder,
        }}
      />
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
            <LayoutGrid className="h-4 w-4" />
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
          <ProjectsBoard
            projects={projects}
            isLoading={isLoading}
            openProject={openProject}
            onCreateProject={() => setOpen(true)}
            permissions={permissions}
          />
        </TabsContent>

        <TabsContent
          value="list"
          className="flex flex-col flex-1 min-h-0 gap-3"
        >
          <ProjectsList
            projects={projects}
            isLoading={isLoading}
            openProject={openProject}
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
  );
}
