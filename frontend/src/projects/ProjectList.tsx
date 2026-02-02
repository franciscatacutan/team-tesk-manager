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
        <p className="text-gray-500 mb-4">There aren't any projects yet.</p>

        <p className="text-sm text-gray-400">
          Create the first project to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <button
          key={project.id}
          type="button"
          onClick={() => onSelect(project.id)}
          className="
            min-w-xs
            group
            w-full text-left
            rounded-xl border border-gray-200
            bg-white p-6
            shadow-sm
            transition-all
            hover:-translate-y-1 hover:shadow-md
            focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
          "
        >
          {/* View Action (Top Right) */}
          <span
            className="
          absolute right-4 top-4
          text-sm text-blue-600
          opacity-0 transition-opacity duration-200
          group-hover:opacity-100
        "
          >
            View →
          </span>

          {/* Title */}
          <h2 className="mb-2 text-lg font-semibold text-gray-900 line-clamp-1">
            {project.name}
          </h2>

          {/* Description */}
          {project.description && (
            <p className="mb-4 text-sm text-gray-600 line-clamp-2">
              {project.description}
            </p>
          )}

          {/* Footer */}
          <div className="flex w-full items-center justify-between text-sm text-gray-500">
            <span>
              Owner:{" "}
              <span className="font-medium text-gray-700">
                {project.owner.firstName} {project.owner.lastName}
              </span>
            </span>
          </div>
        </button>
      ))}
    </div>
  );
}
