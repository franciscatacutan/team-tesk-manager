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

/*
 * Create Modal for Task
 */
export default function TaskFormModal({ projectId, isOpen, onClose }: Props) {
  // Form State
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "",
    assignedUserId: "",
  });

  // Error State
  const [error, setError] = useState("");

  // Create Task
  const createTask = useCreateTask(projectId);

  // Load users for assignee dropdown
  const { data: users, isLoading: usersLoading } = useUsers();

  // Input Change Handler
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // Form Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.title.trim()) {
      setError("Title is required");
      return;
    }

    createTask.mutate(
      {
        title: form.title,
        description: form.description,
        status: (form.status as "TODO" | "IN_PROGRESS" | "DONE") || "TODO",
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
          setError("Failed to create task");
        },
      },
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-xl font-bold mb-4">Create Task</h2>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="title"
          placeholder="Title"
          className="input"
          value={form.title}
          onChange={handleChange}
        />

        <textarea
          name="description"
          placeholder="Description"
          className="input"
          value={form.description}
          onChange={handleChange}
        />

        {/*
         * Assigned User Dropdown
         */}
        <select
          name="assignedUserId"
          className="input"
          value={form.assignedUserId}
          onChange={handleChange}
          disabled={usersLoading}
        >
          <option value="">-- Unassigned --</option>

          {users?.map((user) => (
            <option key={user.id} value={user.id}>
              {user.firstName} {user.lastName}
            </option>
          ))}
        </select>

        {/*
         * Status Dropdown
         */}
        <select
          name="status"
          className="input"
          value={form.status}
          onChange={handleChange}
        >
          <option value="TODO">TODO</option>
          <option value="IN_PROGRESS">IN PROGRESS</option>
          <option value="DONE">DONE</option>
        </select>

        <div className="flex justify-end gap-2">
          <Button size="lg" onClick={onClose} variant="secondary">
            CANCEL
          </Button>

          <Button size="lg" disabled={createTask.isPending} variant="primary">
            {createTask.isPending ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
