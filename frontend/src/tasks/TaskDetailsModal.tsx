import Modal from "../components/Modal";
import type { Task } from "./task.types";

type Props = {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: number) => void;
};

/*
 * Modal to display task details with options to edit or delete the task.
 */
export default function TaskDetailsModal({
  task,
  isOpen,
  onClose,
  onEdit,
  onDelete,
}: Props) {
  if (!task) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <h2 className="text-xl font-bold">{task.title}</h2>

          <button onClick={onClose} className="text-gray-500 hover:text-black">
            ✕
          </button>
        </div>

        <p className="text-gray-600">{task.description}</p>

        <span
          className="
            inline-block px-3 py-1 rounded-full
            text-sm bg-gray-200
          "
        >
          {task.status}
        </span>

        <div className="flex justify-end gap-2 pt-4">
          <button className="btn" onClick={() => onEdit(task)}>
            Edit
          </button>

          <button
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
            onClick={() => onDelete(task.id)}
          >
            Delete
          </button>
        </div>
      </div>
    </Modal>
  );
}
