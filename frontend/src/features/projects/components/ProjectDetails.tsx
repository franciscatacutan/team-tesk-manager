import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";

import { useProject } from "../hooks/useProject";

import TaskBoard from "../../tasks/components/TaskBoard";
import TaskModal from "../../tasks/components/TaskModal";

import type { Task } from "../../tasks/types/task.types";
import type { TaskStatus } from "../../tasks/utils/taskStatus";

import TaskFilters from "../../tasks/components/TaskFilters";
import ProjectHeader from "../../projects/components/ProjectHeader";
import { useDebounce } from "../../../common/hooks/useDebounce";
import TaskList from "../../tasks/components/TaskList";
import { useUpdateTaskStatus } from "../../tasks/hooks/useUpdateTaskStatus";
import { useTasks } from "../../tasks/hooks/useTasks";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/ui/tabs";
import { Kanban, LayoutList, ListCheck } from "lucide-react";
import { CreateTaskModal } from "../../tasks/components/CreateTaskModal";
import ProjectActivity from "../../projects/components/ProjectActivity";
import { getProjectPermissions } from "../../projects/utils/projectPermissions";
import { useTeamMe } from "../../teams/hooks/useTeamMe";
import type { DeletedFilter } from "../../../common/types/deletedFilter.types";
import { getUserFromToken } from "../../users/api/userApi";

export default function ProjectDetails() {
  const navigate = useNavigate();
  const { teamId, projectId } = useParams<{
    teamId: string;
    projectId: string;
  }>();

  const [deletedFilter, setDeletedFilter] = useState<DeletedFilter>("ACTIVE");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [sort, setSort] = useState("createdAt,desc");
  const debouncedSearch = useDebounce(search, 400);

  const {
    data: project,
    isLoading,
    isError,
  } = useProject(
    teamId || "",
    projectId || "",
  );

  const user = getUserFromToken();
  const { data: teamMe } = useTeamMe(teamId || "");

  const permissions = getProjectPermissions({
    globalRole: user?.role,
    teamRole: teamMe?.role,
  });

  const { data: tasksData, isLoading: isTasksLoading } = useTasks(
    teamId || "",
    projectId || "",
    {
      page,
      size,
      search: debouncedSearch,
      status,
      sort,
      deletedFilter,
    },
  );

  const tasks = tasksData?.content ?? [];
  const totalPages = tasksData?.totalPages ?? 0;
  const totalElements = tasksData?.totalElements ?? 0;
  const hasActiveTaskFilters =
    Boolean(search.trim()) || Boolean(status) || deletedFilter !== "ACTIVE";

  const updateStatus = useUpdateTaskStatus(teamId || "", projectId || "");

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

  function handleStatusChange(taskId: string, status: TaskStatus) {
    updateStatus.mutate({
      taskId,
      status,
    });
  }

  if (!teamId || !projectId) {
    return (
      <ProjectDetailsState
        title="Invalid project"
        description="This project route is missing the team or project identifier."
      />
    );
  }

  if (isLoading) {
    return <ProjectDetailsSkeleton />;
  }

  if (isError || !project) {
    return (
      <ProjectDetailsState
        title="Project not found"
        description="The project may have been deleted, moved, or you may not have access to it."
      />
    );
  }

  return (
    <div className="flex flex-col h-full min-h-0 gap-6 ">
      <div className="text-sm text-muted-foreground">
        Team / {project?.name}
      </div>
      <ProjectHeader
        teamId={teamId}
        projectId={projectId}
        name={project.name}
        description={project?.description}
        onCreateTask={() => setCreateOpen(true)}
        onProjectDeleted={() => navigate(`/teams/${teamId}/projects`)}
        permissions={permissions}
      />
      <CreateTaskModal
        teamId={teamId}
        projectId={projectId}
        open={createOpen}
        onOpenChange={setCreateOpen}
      />
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

          <TabsTrigger
            value="activity"
            className=" flex items-center gap-2 px-3 py-1.5 text-sm rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-foreground text-muted-foreground hover:bg-muted transition-all "
          >
            <ListCheck className="h-4 w-4" />
            Activity
          </TabsTrigger>
        </TabsList>
        <div className="flex flex-col flex-1 min-h-0">
          <TabsContent
            value="board"
            className="flex flex-col flex-1 min-h-0 gap-3"
          >
            <TaskFilters
              search={search}
              status={status}
              deletedFilter={deletedFilter}
              onSearchChange={handleSearchChange}
              onStatusFilterChange={handleStatusFilterChange}
              onDeletedFilterChange={handleDeletedFilterChange}
            />
            <TaskBoard
              teamId={teamId}
              projectId={projectId}
              params={{
                search: debouncedSearch,
                status,
                sort,
                deletedFilter,
              }}
              onStatusChange={handleStatusChange}
              onOpenTask={setSelectedTask}
            />
          </TabsContent>
          <TabsContent
            value="list"
            className="flex flex-col flex-1 min-h-0 gap-3"
          >
            <TaskFilters
              search={search}
              status={status}
              deletedFilter={deletedFilter}
              onSearchChange={handleSearchChange}
              onStatusFilterChange={handleStatusFilterChange}
              onDeletedFilterChange={handleDeletedFilterChange}
            />
            <TaskList
              tasks={tasks}
              teamId={teamId}
              projectId={projectId}
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
              sort={sort}
              onSortChange={setSort}
              isLoading={isTasksLoading}
              canCreateTask={permissions.canCreateTask}
              hasActiveFilters={hasActiveTaskFilters}
              onCreateTask={() => setCreateOpen(true)}
            />
          </TabsContent>
          <TabsContent
            value="activity"
            className="flex flex-col flex-1 min-h-0"
          >
            <ProjectActivity
              teamId={teamId}
              projectId={projectId}
              onOpenTask={(taskId) => setSelectedTask({ id: taskId } as Task)}
            />
          </TabsContent>
        </div>
      </Tabs>
      {selectedTask && (
        <TaskModal
          open={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          onTaskDeleted={() => setSelectedTask(null)}
          taskId={selectedTask.id}
          teamId={teamId}
          projectId={projectId}
        />
      )}
    </div>
  );
}

function ProjectDetailsSkeleton() {
  return (
    <div className="flex h-full min-h-0 flex-col gap-6">
      <div className="h-4 w-44 animate-pulse rounded-md bg-muted" />

      <div className="flex items-start justify-between gap-6">
        <div className="flex-1 space-y-3">
          <div className="h-8 w-72 animate-pulse rounded-md bg-muted" />
          <div className="h-4 w-full max-w-xl animate-pulse rounded-md bg-muted" />
          <div className="h-4 w-2/3 max-w-md animate-pulse rounded-md bg-muted" />
        </div>

        <div className="h-10 w-28 animate-pulse rounded-xl bg-muted" />
      </div>

      <div className="h-10 w-72 animate-pulse rounded-xl bg-muted" />

      <div className="grid gap-4 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="h-64 animate-pulse rounded-2xl border border-border/60 bg-muted/25"
          />
        ))}
      </div>
    </div>
  );
}

function ProjectDetailsState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex h-full min-h-0 items-center justify-center rounded-2xl border border-dashed border-border/70 bg-background/75 px-6 py-16 text-center">
      <div>
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
}
