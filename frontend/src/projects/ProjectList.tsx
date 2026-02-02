import type { Project } from "./project.types";

type Props = {
  projects: Project[];
  onSelect: (projectId: number) => void;
};

/*
 * Component to display a list of project.
 */
export default function ProjectList({ projects, onSelect }: Props) {
  if (projects.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 mb-4">You don’t have any projects yet.</p>

        <p className="text-sm text-gray-400">
          Create your first project to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <div
          key={project.id}
          onClick={() => onSelect(project.id)}
          className="
            card cursor-pointer
            p-6
            hover:shadow-lg
            transition
            border
          "
        >
          <h2 className="text-lg font-semibold mb-2">{project.name}</h2>

          {project.description && (
            <p className="text-gray-500 text-sm">{project.description}</p>
          )}
        </div>
      ))}
    </div>
  );
}
