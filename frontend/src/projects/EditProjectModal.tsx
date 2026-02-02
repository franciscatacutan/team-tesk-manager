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
  // Error State
  const [error, setError] = useState("");
  const updateProject = useUpdateProject(project.id);

  const [form, setForm] = useState({
    name: project.name,
    description: project.description,
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setForm({
      name: project.name,
      description: project.description,
    });

    setError("");
  }, [project, isOpen]);

  // Generic change handler
  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    // const { name, value } = e.target;

    setForm(() => ({
      ...form,
      [e.target.name]: e.target.value,
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.name.trim()) {
      setError("Project name is required");
      return;
    }

    updateProject.mutate(
      {
        name: form.name,
        description: form.description,
      },
      {
        onSuccess: onClose,
        onError: () => setError("Failed to update project"),
      },
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
          Edit Project
        </h2>
        <p className="mt-1 text-sm text-gray-500">Update project details.</p>
      </div>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Title</label>
          <input
            name="name"
            className="input"
            value={form.name}
            maxLength={80}
            placeholder="Name"
            onChange={handleChange}
          />
        </div>
        {/* Description */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            className="input resize-none min-h-[100px]"
            value={form.description}
            maxLength={140}
            placeholder="Short description (optional)"
            onChange={handleChange}
          />
          <p className="text-xs text-gray-400 text-right">
            {form.description?.length} / 140
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 border-t pt-4">
          <Button size="md" onClick={onClose} variant="secondary">
            CANCEL
          </Button>
          <Button
            size="md"
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
