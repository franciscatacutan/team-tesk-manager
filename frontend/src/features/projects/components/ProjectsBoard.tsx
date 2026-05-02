import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

import type { Project } from "../types/project.types";
import type { ProjectPermissions } from "../utils/projectPermissions";
import ProjectCard from "./ProjectCard";

interface Props {
  projects: Project[];
  isLoading: boolean;
  openProject: (projectId: string) => void;
  onCreateProject: () => void;
  permissions: ProjectPermissions;
}

export default function ProjectsBoard({
  projects,
  isLoading,
  openProject,
  onCreateProject,
  permissions,
}: Props) {
  return (
    <>
      {isLoading ? (
        <div className="overflow-hidden p-4 rounded-2xl border border-border/60 bg-background shadow-sm">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {Array.from({ length: 12 }).map((_, index) => (
              <div
                key={index}
                className="h-56 animate-pulse rounded-2xl border border-border/60 bg-muted/25"
              />
            ))}
          </div>
        </div>
      ) : projects.length > 0 ? (
        <div className="flex-1 overflow-y-auto p-4 rounded-2xl border border-border/60 bg-background shadow-sm">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onClick={() => openProject(project.id)}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-border/70 bg-background/75 px-6 py-16 text-center">
          <h2 className="text-lg font-semibold text-foreground">
            No projects found
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            Try changing the search or filters, or create a new project to get
            started.
          </p>

          {permissions.canCreateProject && (
            <Button className="mt-6 rounded-xl" onClick={onCreateProject}>
              <Plus className="h-4 w-4" />
              Create project
            </Button>
          )}
        </div>
      )}
    </>
  );
}
