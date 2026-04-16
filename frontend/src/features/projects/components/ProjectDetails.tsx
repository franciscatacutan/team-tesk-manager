import { useParams } from "react-router-dom";
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

  const { data: project, isLoading } = useProject(
    teamId || "",
    projectId || "",
  );

  const user = getUserFromToken();
  const { data: teamMe } = useTeamMe(teamId || "");

  const permissions = getProjectPermissions({
    globalRole: user?.role,
    teamRole: teamMe?.role,
  });

  const { data: tasksData } = useTasks(teamId || "", projectId || "", {
    page,
    size,
    search: debouncedSearch,
    status,
    sort,
    deletedFilter,
  });

  const tasks = tasksData?.content ?? [];
  const totalPages = tasksData?.totalPages ?? 0;
  const totalElements = tasksData?.totalElements ?? 0;

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
    return <div className="p-6">Invalid project</div>;
  }

  if (isLoading || !project) {
    return <div className="p-6">Loading Project...</div>;
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
