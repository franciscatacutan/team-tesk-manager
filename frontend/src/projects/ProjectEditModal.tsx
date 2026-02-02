import { useState, useEffect } from "react";
import Modal from "../components/Modal";
import type { Project } from "./project.types";
import { useUpdateProject } from "./useUpdateProject";
import Button from "../components/Button";

type Props = {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
};

/*
 * Edit Modal for Project
 */
export default function EditProjectModal({ project, isOpen, onClose }: Props) {
  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(project.description || "");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setName(project.name);
    setDescription(project.description || "");
    setError("");
  }, [project, isOpen]);

  const updateProject = useUpdateProject(project.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("Project name is required");
      return;
    }

    updateProject.mutate(
      { name, description },
      {
        onSuccess: onClose,
        onError: () => setError("Failed to update project"),
      },
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-xl font-bold mb-4">Edit Project</h2>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="input"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <textarea
          className="input"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="flex justify-end gap-2">
          <Button size="lg" onClick={onClose} variant="secondary">
            CANCEL
          </Button>

          <Button
            size="lg"
            disabled={updateProject.isPending}
            variant="primary"
          >
            {updateProject.isPending ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
