import EditableField from "../../../common/components/EditableField";
import { Button } from "../../../components/ui/button";
import { useUpdateProject } from "../hooks/useUpdateProject";
import type { ProjectPermissions } from "../utils/projectPermissions";
import { DeleteProjectButton } from "./DeleteProjectButton";

interface Props {
  permissions: ProjectPermissions;
  teamId: string;
  projectId: string;
  name: string;
  description?: string;
  onCreateTask: () => void;
  onProjectDeleted?: () => void;
}

export default function ProjectHeader({
  teamId,
  projectId,
  name,
  description,
  permissions,
  onCreateTask,
  onProjectDeleted,
}: Props) {
  const updateProject = useUpdateProject(teamId, projectId);

  return (
    <header className="rounded-2xl border border-border/60 bg-background/95 p-4 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex-1 space-y-1.5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Project workspace
          </p>
          <EditableField
            displayClassName="w-full text-2xl font-semibold tracking-tight"
            inputClassName="w-full text-2xl font-semibold"
            value={name}
            maxLength={100}
            onSave={(value) => updateProject.mutate({ name: value })}
            disabled={!permissions.canEditProjectDetails}
          />

          <EditableField
            displayClassName="w-full text-sm leading-relaxed text-muted-foreground"
            inputClassName="w-full text-sm"
            placeholder="No Description Yet"
            multiline
            value={description}
            maxLength={2000}
            onSave={(value) => updateProject.mutate({ description: value })}
            disabled={!permissions.canEditProjectDetails}
          />
        </div>

        <div className="flex items-center gap-2">
          {permissions.canCreateTask && (
            <Button onClick={onCreateTask}>Create Task</Button>
          )}
          {permissions.canDeleteProject && (
            <DeleteProjectButton
              teamId={teamId}
              projectId={projectId}
              projectName={name}
              onProjectDeleted={onProjectDeleted}
            />
          )}
        </div>
      </div>
    </header>
  );
}
