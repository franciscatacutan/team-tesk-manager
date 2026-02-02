import { useState, useEffect } from "react";
import Modal from "../components/Modal";
import type { Task } from "./task.types";
import { useUsers } from "../users/useUsers";
import { useUpdateTask } from "./useUpdateTask";
import Button from "../components/Button";

type Props = {
  projectId: number;
  task: Task;
  isOwner: boolean;
  isOpen: boolean;
  onClose: () => void;
};

type TaskForm = {
  title: string;
  description: string;
  assignedUserId: string;
};

/*
 * Edit Modal for Task
 */
export default function EditTaskModal({
  projectId,
  task,
  isOwner,
  isOpen,
  onClose,
}: Props) {
  const [form, setForm] = useState<TaskForm>({
    title: "",
    description: "",
    assignedUserId: "",
  });

  const [error, setError] = useState("");

  const updateTask = useUpdateTask(projectId, task.id);
  const { data: users } = useUsers();

  // Sync form when modal opens or task changes
  useEffect(() => {
    if (!isOpen) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setForm({
      title: task.title ?? "",
      description: task.description ?? "",
      assignedUserId: task.assignedUser?.id?.toString() ?? "",
    });

    setError("");
  }, [task, isOpen]);

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

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!form.title.trim()) {
      setError("Task title is required.");
      return;
    }

    updateTask.mutate(
      {
        title: form.title.trim(),
        description: form.description.trim(),
        assignedUserId: form.assignedUserId
          ? Number(form.assignedUserId)
          : null,
      },
      {
        onSuccess: onClose,
        onError: () => setError("Failed to update task."),
      },
    );
  }

  if (!isOwner) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
          Edit Task
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Update task details and assignment.
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
            value={form.title}
            maxLength={80}
            placeholder="Enter task title"
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
          >
            <option value="">Unassigned</option>
            {users?.map((u) => (
              <option key={u.id} value={u.id}>
                {u.firstName} {u.lastName}
              </option>
            ))}
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
            disabled={updateTask.isPending}
          >
            {updateTask.isPending ? "Saving..." : "Save changes"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
