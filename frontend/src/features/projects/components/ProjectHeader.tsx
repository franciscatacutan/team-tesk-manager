import { CalendarDays, User, Sparkles } from "lucide-react";
import EditableField from "../../../common/components/EditableField";
import { Button } from "../../../components/ui/button";
import { Avatar, AvatarFallback } from "../../../components/ui/avatar";
import {
  formatDate,
  formatDateTimeShort,
} from "../../../common/utils/dateFormatter";
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
    <header className="rounded-3xl border border-border/60 bg-background/95 p-6 shadow-sm shadow-slate-900/5">
      <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
        <div className="flex-1 space-y-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center rounded-full border border-border/70 bg-muted/25 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Project workspace
              </span>
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

            <div className="flex flex-wrap items-center gap-3">
              {permissions.canCreateTask && (
                <Button onClick={onCreateTask}>Create Task</Button>
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

          <div className="space-y-3">
            <EditableField
              displayClassName="w-full text-3xl font-semibold tracking-tight text-foreground"
              inputClassName="w-full text-3xl font-semibold"
              value={project.name}
              maxLength={100}
              onSave={(value) => updateProject.mutate({ name: value })}
              disabled={!permissions.canEditProjectDetails}
            />
            <EditableField
              displayClassName="block w-full text-sm leading-7 text-muted-foreground"
              inputClassName="w-full text-sm"
              placeholder="Add a concise project summary or goal"
              multiline
              value={project.description}
              maxLength={2000}
              onSave={(value) => updateProject.mutate({ description: value })}
              disabled={!permissions.canEditProjectDetails}
            />
          </div>

          <div className="grid gap-2.5 sm:grid-cols-1 lg:grid-cols-3">
            <div className="rounded-2xl border border-border/60 bg-muted/50 p-3 shadow-sm">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                <User className="h-3.5 w-3.5" />
                Project owner
              </div>
              <div className="mt-2.5 flex items-center gap-2">
                <Avatar className="h-8 w-8 ring-1 ring-border/60">
                  <AvatarFallback className="text-xs">
                    {owner.firstName?.[0]}
                    {owner.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-foreground">
                    {ownerName}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {owner.email}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-border/60 bg-muted/50 p-3 shadow-sm">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                <CalendarDays className="h-3.5 w-3.5" />
                Timeline
              </div>
              <div className="mt-2.5 space-y-2 text-xs text-foreground">
                <div className="flex items-center justify-between gap-2 rounded-lg bg-background/80 px-2 py-1.5">
                  <span className="text-xs text-muted-foreground">
                    Planned start
                  </span>
                  <span className="font-medium">
                    {project.plannedStartDate
                      ? formatDate(project.plannedStartDate)
                      : "TBD"}
                  </span>
                </div>
                {project.plannedDueDate ? (
                  <div className="flex items-center justify-between gap-2 rounded-lg bg-background/80 px-2 py-1.5">
                    <span className="text-xs text-muted-foreground">
                      Planned due
                    </span>
                    <span className="font-medium">
                      {project.plannedDueDate
                        ? formatDate(project.plannedDueDate)
                        : "TBD"}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-2 rounded-lg bg-background/80 px-2 py-1.5">
                    <span className="text-xs text-muted-foreground">
                      Completion
                    </span>
                    <span className="font-medium">
                      {project.actualCompletionDate
                        ? formatDate(project.actualCompletionDate)
                        : "Pending"}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-border/60 bg-muted/50 p-3 shadow-sm">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5" />
                Activity and status
              </div>
              <div className="mt-2.5 space-y-2 text-xs text-foreground">
                <div className="flex items-center justify-between gap-2 rounded-lg bg-background/80 px-2 py-1.5">
                  <span className="text-xs text-muted-foreground">
                    Last activity
                  </span>
                  <span className="font-medium">
                    {formatDateTimeShort(project.lastActivityAt)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2 rounded-lg bg-background/80 px-2 py-1.5">
                  <span className="text-xs text-muted-foreground">Created</span>
                  <span className="font-medium">
                    {formatDateTimeShort(project.createdAt)}
                  </span>
                </div>
                {/* <div className="flex items-center justify-between gap-2 rounded-lg bg-background/80 px-2 py-1.5">
                  <span className="text-xs text-muted-foreground">Updated</span>
                  <span className="font-medium">
                    {formatDateTimeShort(project.updatedAt)}
                  </span>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
