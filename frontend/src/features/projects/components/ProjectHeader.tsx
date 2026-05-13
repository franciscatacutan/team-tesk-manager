import EditableField from "../../../common/components/EditableField";
import { Button } from "../../../components/ui/button";
import { Avatar, AvatarFallback } from "../../../components/ui/avatar";
import { formatDate } from "../../../common/utils/dateFormatter";
import { useUpdateProject } from "../hooks/useUpdateProject";
import { useUpdateProjectStatus } from "../hooks/useUpdateProjectStatus";
import type { Project, ProjectStatus } from "../types/project.types";
import {
  ProjectStatusLabel,
  ProjectStatusStyles,
} from "../utils/project.constants";
import type { ProjectPermissions } from "../utils/projectPermissions";
import { DeleteProjectButton } from "./DeleteProjectButton";
import ProjectStatusSelector from "./ProjectStatusSelector";

interface Props {
  permissions: ProjectPermissions;
  teamId: string;
  project: Project;
  onCreateTask: () => void;
  onProjectDeleted?: () => void;
}

export default function ProjectHeader({
  teamId,
  project,
  permissions,
  onCreateTask,
  onProjectDeleted,
}: Props) {
  const updateProject = useUpdateProject(teamId, project.id);
  const updateProjectStatus = useUpdateProjectStatus(teamId);

  const owner = project.owner ?? project.createdBy;
  const ownerName = `${owner.firstName} ${owner.lastName}`;

  function handleStatusChange(projectId: string, status: ProjectStatus) {
    updateProjectStatus.mutate({
      projectId,
      status,
    });
  }

  return (
    <header className="rounded-2xl border border-border/60 bg-background/95 p-6 shadow-sm shadow-slate-900/5">
      <div className="relative flex flex-col gap-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 flex-1">
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center rounded-full border border-border/70 bg-muted/25 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Project Workspace
              </span>

              <div className="h-1 w-1 rounded-full bg-border" />

              <div>
                {permissions.canChangeProjectStatus ? (
                  <ProjectStatusSelector
                    value={project.status}
                    onChange={(status) =>
                      handleStatusChange(project.id, status)
                    }
                  />
                ) : (
                  <span className={ProjectStatusStyles[project.status]}>
                    {ProjectStatusLabel[project.status]}
                  </span>
                )}
              </div>
            </div>

            <EditableField
              displayClassName="w-full text-xl font-semibold leading-[1] tracking-[-0.07em] text-foreground sm:text-2xl"
              inputClassName=" w-full text-xl font-semibold tracking-[-0.07em] sm:text-2xl"
              value={project.name}
              maxLength={100}
              onSave={(value) => updateProject.mutate({ name: value })}
              disabled={!permissions.canEditProjectDetails}
            />

            <EditableField
              displayClassName="w-full text-sm leading-7 text-muted-foreground "
              inputClassName="w-full text-sm"
              placeholder="Add a concise project summary or goal"
              multiline
              value={project.description}
              maxLength={2000}
              onSave={(value) => updateProject.mutate({ description: value })}
              disabled={!permissions.canEditProjectDetails}
            />
          </div>

          <div className="flex shrink-0 items-center gap-3 pt-1">
            {permissions.canCreateTask && (
              <Button
                onClick={onCreateTask}
                className="h-11 rounded-2xl px-5 text-sm font-medium shadow-sm transition-all hover:-translate-y-0.5 "
              >
                Create Task
              </Button>
            )}

            {permissions.canDeleteProject && (
              <DeleteProjectButton
                teamId={teamId}
                projectId={project.id}
                projectName={project.name}
                onProjectDeleted={onProjectDeleted}
              />
            )}
          </div>
        </div>

        <div className="flex flex-col gap-5 border-t border-border/50 pt-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8 border border-border/60">
              <AvatarFallback className="text-xs font-medium">
                {owner.firstName?.[0]}
                {owner.lastName?.[0]}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                Owner
              </p>

              <p className="truncate text-sm font-semibold text-foreground">
                {ownerName}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center sm:text-center gap-x-8 gap-y-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                Planned
              </p>

              <p className="mt-1 text-sm font-medium text-foreground">
                {project.plannedStartDate
                  ? formatDate(project.plannedStartDate)
                  : "TBD"}
                {" → "}
                {project.plannedDueDate
                  ? formatDate(project.plannedDueDate)
                  : "TBD"}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                Actual
              </p>

              <p className="mt-1 text-sm font-medium text-foreground">
                {project.actualStartDate
                  ? formatDate(project.actualStartDate)
                  : "—"}
                {" → "}
                {project.actualCompletionDate
                  ? formatDate(project.actualCompletionDate)
                  : "—"}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                Last Activity
              </p>

              <p className="mt-1 text-sm font-medium text-foreground">
                {formatDate(project.lastActivityAt)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
