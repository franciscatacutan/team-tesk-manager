import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { useDebounce } from "../../../common/hooks/useDebounce";
// import Pagination from "../../../common/components/pagination/PaginationControls";
import { useProjects } from "../hooks/useProjects";
import { CreateProjectModal } from "./CreateProjectModal";
import ProjectCard from "./ProjectCard";
import { ProjectsHeader } from "./ProjectsHeader";
import ProjectsToolbar from "./ProjectsToolBar";
import type { DeletedFilter } from "../../../common/types/deletedFilter.types";
import { useTeamMe } from "../../teams/hooks/useTeamMe";
import { getProjectPermissions } from "../utils/projectPermissions";
import { getUserFromToken } from "../../users/api/userApi";
import { Pagination } from "../../../common/components/pagination/Pagination";

export default function ProjectsPage() {
  const { teamId } = useParams<{
    teamId: string;
  }>();

  const navigate = useNavigate();

  const [page, setPage] = useState(0);
  const [size, setSize] = useState(12);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [sort, setSort] = useState("createdAt,desc");
  const [deletedFilter, setDeletedFilter] = useState<DeletedFilter>("ACTIVE");

  const debouncedSearch = useDebounce(search, 400);

  const { data, isLoading } = useProjects(teamId || "", {
    page,
    size,
    search: debouncedSearch,
    status,
    sort,
    deletedFilter,
  });

  const projects = data?.content ?? [];
  const totalPages = data?.totalPages ?? 0;
  const totalElements = data?.totalElements ?? 0;

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(0);
  };

  const handleStatusFilterChange = (value: string) => {
    setStatus(value === "ALL" ? "" : value);
    setPage(0);
  };

  const handleDeletedFilterChange = (value: DeletedFilter) => {
    setDeletedFilter(value);
    setPage(0);
  };

  const [createOpen, setCreateOpen] = useState(false);

  function openProject(projectId: string) {
    navigate(`/teams/${teamId}/projects/${projectId}`);
  }

  const user = getUserFromToken();
  const { data: teamMe } = useTeamMe(teamId || "");

  const permissions = getProjectPermissions({
    globalRole: user?.role,
    teamRole: teamMe?.role,
  });

  if (!teamId) {
    return <div className="p-6">Invalid project</div>;
  }

  return (
    <div className="space-y-6 flex flex-1 flex-col min-h-0 h-full">
      <ProjectsHeader
        permissions={permissions}
        onCreateProject={() => setCreateOpen(true)}
      />

      <CreateProjectModal
        teamId={teamId}
        open={createOpen}
        onOpenChange={setCreateOpen}
      />

      <ProjectsToolbar
        permissions={permissions}
        search={search}
        onSearchChange={handleSearchChange}
        onStatusChange={handleStatusFilterChange}
        onSortChange={setSort}
        onDeletedFilterChange={handleDeletedFilterChange}
        status={status}
        sort={sort}
        deletedFilter={deletedFilter}
      />

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-44 animate-pulse rounded-2xl border border-border/60 bg-muted/25"
            />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border/70 bg-background/70 px-6 py-14 text-center">
          <h2 className="text-base font-semibold text-foreground">
            No projects found
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Try changing the filters, or create a new project for this team.
          </p>
        </div>
      ) : (
        <div className="flex flex-col h-full min-h-0">
          <div className="flex-1 overflow-y-auto p-1">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onClick={() => openProject(project.id)}
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
      )}
    </div>
  );
}
