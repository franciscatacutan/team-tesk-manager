import { useState } from "react";
import Modal from "../components/Modal";
import type { Project } from "./project.types";
import { useUpdateProject } from "./useUpdateProject";

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

  const updateProject = useUpdateProject(project.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    updateProject.mutate({ name, description }, { onSuccess: onClose });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-xl font-bold mb-4">Edit Project</h2>

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
          <button
            type="button"
            className="btn bg-gray-200 text-black"
            onClick={onClose}
          >
            Cancel
          </button>

          <button className="btn">Save</button>
        </div>
      </form>
    </Modal>
  );
}
