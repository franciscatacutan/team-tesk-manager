import { useState } from "react";
import Modal from "../components/Modal";
import { useCreateProject } from "./useCreateProject";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

/*
 * Create Modal for Project
 */
export default function TaskFormModal({ isOpen, onClose }: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const createProject = useCreateProject();

  // Form Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Project name is required");
      return;
    }

    createProject.mutate(
      { name, description },
      {
        onSuccess: () => {
          setName("");
          setDescription("");
          onClose();
        },
        onError: () => {
          setError("Failed to create project");
        },
      },
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-xl font-bold mb-4">Create Project</h2>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="input"
          placeholder="Project name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <textarea
          className="input"
          placeholder="Description (optional)"
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

          <button className="btn" disabled={createProject.isPending}>
            {createProject.isPending ? "Creating..." : "Create"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
