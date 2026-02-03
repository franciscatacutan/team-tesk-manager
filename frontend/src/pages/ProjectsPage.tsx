import { useProjects } from "../projects/useProjects";
import ProjectList from "../projects/ProjectList";
import { useNavigate } from "react-router-dom";
import CreateProjectModal from "../projects/CreateProjectModal";
import { useState } from "react";
import Button from "../components/Button";

/*
 * Project page showing projects.
 */
export default function ProjectsPage() {
  const { data, isLoading } = useProjects();
  const navigate = useNavigate();

  const [showCreate, setShowCreate] = useState(false);

  if (isLoading) {
    return (
      <div className="page flex justify-center items-center">
        <p>Loading projects...</p>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="max-w-5xl w-full mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Projects</h1>
            <p className="text-gray-500">Select a project to view its tasks</p>
          </div>

          <Button
            size="lg"
            variant="primary"
            onClick={() => setShowCreate(true)}
          >
            + Add Project
          </Button>
        </div>

        {/* Content */}
        <div className="min-h-[300px]">
          {data && data.length > 0 ? (
            <ProjectList
              projects={data}
              onSelect={(id) => navigate(`/projects/${id}`)}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-[300px] border border-dashed rounded-lg text-gray-500">
              <p className="text-lg font-medium">No projects yet</p>
              <p className="text-sm">
                Click “Add Project” to create your first project
              </p>
            </div>
          )}
        </div>

        {/* Modal */}
        <CreateProjectModal
          isOpen={showCreate}
          onClose={() => setShowCreate(false)}
        />
      </div>
    </div>
  );
}
