import { useProjects } from "../projects/useProjects";
import ProjectList from "../projects/ProjectList";
import { useNavigate } from "react-router-dom";
import CreateProjectModal from "../projects/ProjectFormModal";
import { useState } from "react";

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
      {/* Page Container */}
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Projects</h1>
            <p className="text-gray-500">Select a project to view its tasks</p>
          </div>

          <button className="btn" onClick={() => setShowCreate(true)}>
            + New Project
          </button>
        </div>

        {/* Content */}
        {data && (
          <ProjectList
            projects={data}
            onSelect={(id) => navigate(`/projects/${id}`)}
          />
        )}
        {/*
         * Project Creation Modal
         */}
        <CreateProjectModal
          isOpen={showCreate}
          onClose={() => setShowCreate(false)}
        />
      </div>
    </div>
  );
}
