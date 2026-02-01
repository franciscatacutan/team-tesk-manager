import { useState } from "react";
import Modal from "../components/Modal";
import type { Task } from "./task.types";
import { useUsers } from "../users/useUsers";
import { useUpdateTask } from "./useUpdateTask";

type Props = {
  task: Task;
  isOwner: boolean;
  isOpen: boolean;
  onClose: () => void;
};

/*
 * Edit Modal for Task
 */
export default function TaskEditModal({
  task,
  isOwner,
  isOpen,
  onClose,
}: Props) {
  const [form, setForm] = useState({
    title: task.title,
    description: task.description,
    assignedUserId: task.assignedUser?.id ?? "",
  });

  // Load Task data for Edit
  const updateTask = useUpdateTask(task.id);

  // Load User data
  const { data: users } = useUsers();

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
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    updateTask.mutate(
      {
        title: form.title,
        description: form.description,
        assignedUserId: form.assignedUserId
          ? Number(form.assignedUserId)
          : null,
      },
      { onSuccess: onClose },
    );
  };

  if (!isOwner) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-xl font-bold mb-4">Edit Task</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="title"
          className="input"
          value={form.title}
          onChange={handleChange}
        />

        <textarea
          name="description"
          className="input"
          value={form.description}
          onChange={handleChange}
        />

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

        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose}>
            Cancel
          </button>
          <button className="btn">Save</button>
        </div>
      </form>
    </Modal>
  );
}
