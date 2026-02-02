import { useState } from "react";
import Modal from "../components/Modal";
import { useCreateProject } from "./useCreateProject";
import Button from "../components/Button";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

type ProjectForm = {
  name: string;
  description: string;
};

/*
 * Create Modal for Project
 */
export default function CreateProjectModal({ isOpen, onClose }: Props) {
  const [form, setForm] = useState<ProjectForm>({
    name: "",
    description: "",
  });

  const [error, setError] = useState("");

  const createProject = useCreateProject();

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!form.name.trim()) {
      setError("Project name is required.");
      return;
    }

    createProject.mutate(
      {
        name: form.name.trim(),
        description: form.description.trim(),
      },
      {
        onSuccess: () => {
          setForm({ name: "", description: "" });
          onClose();
        },
        onError: () => {
          setError("Failed to create project. Please try again.");
        },
      },
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
          Create Project
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Add a new project to organize your tasks.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">
            Project name
          </label>
          <input
            name="name"
            className="input"
            placeholder="Enter project name"
            value={form.name}
            maxLength={80}
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
            placeholder="Short description (optional)"
            value={form.description}
            maxLength={140}
            onChange={handleChange}
          />
          <p className="text-xs text-gray-400 text-right">
            {form.description.length} / 140
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 border-t pt-4">
          <Button type="button" size="md" variant="secondary" onClick={onClose}>
            Cancel
          </Button>

          <Button
            type="submit"
            size="md"
            variant="primary"
            disabled={createProject.isPending}
          >
            {createProject.isPending ? "Creating..." : "Create project"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
