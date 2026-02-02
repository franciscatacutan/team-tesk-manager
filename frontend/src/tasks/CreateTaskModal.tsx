import { useState } from "react";
import Modal from "../components/Modal";
import { useCreateTask } from "./useCreateTask";
import { useUsers } from "../users/useUsers";
import Button from "../components/Button";

type Props = {
  projectId: number;
  isOpen: boolean;
  onClose: () => void;
};

type TaskForm = {
  title: string;
  description: string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
  assignedUserId: string;
};

/*
 * Create Modal for Task
 */
export default function CreateTaskModal({ projectId, isOpen, onClose }: Props) {
  const [form, setForm] = useState<TaskForm>({
    title: "",
    description: "",
    status: "TODO",
    assignedUserId: "",
  });

  const [error, setError] = useState("");

  const createTask = useCreateTask(projectId);
  const { data: users, isLoading: usersLoading } = useUsers();

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
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

    if (!form.title.trim()) {
      setError("Task title is required.");
      return;
    }

    createTask.mutate(
      {
        title: form.title.trim(),
        description: form.description.trim(),
        status: form.status,
        assignedUserId: form.assignedUserId
          ? Number(form.assignedUserId)
          : null,
      },
      {
        onSuccess: () => {
          setForm({
            title: "",
            description: "",
            status: "TODO",
            assignedUserId: "",
          });
          onClose();
        },
        onError: () => {
          setError("Failed to create task. Please try again.");
        },
      },
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
          Create Task
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Add a new task to this project.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Title</label>
          <input
            name="title"
            className="input"
            placeholder="Enter task title"
            value={form.title}
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

        {/* Assignee */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Assign to</label>
          <select
            name="assignedUserId"
            className="input"
            value={form.assignedUserId}
            onChange={handleChange}
            disabled={usersLoading}
          >
            <option value="">Unassigned</option>
            {users?.map((user) => (
              <option key={user.id} value={user.id}>
                {user.firstName} {user.lastName}
              </option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Status</label>
          <select
            name="status"
            className="input"
            value={form.status}
            onChange={handleChange}
          >
            <option value="TODO">To do</option>
            <option value="IN_PROGRESS">In progress</option>
            <option value="DONE">Done</option>
          </select>
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
            disabled={createTask.isPending}
          >
            {createTask.isPending ? "Creating..." : "Create task"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
