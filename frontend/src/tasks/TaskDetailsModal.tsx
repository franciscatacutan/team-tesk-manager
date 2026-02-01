import Modal from "../components/Modal";
import type { Task } from "./task.types";

type Props = {
  task: Task | null;
  isOwner: boolean;
  isAssignee: boolean;
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  onStatusChange: (status: string) => void;
};

/*
 * Modal to display task details with options to edit or delete the task.
 */
export default function TaskDetailsModal({
  task,
  isOwner,
  isAssignee,
  isOpen,
  onClose,
  onEdit,
  onStatusChange,
}: Props) {
  if (!task) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-xl font-bold">{task.title}</h2>

      <p className="text-gray-500">{task.description}</p>

      {task.assignedUser && (
        <p className="text-sm text-gray-400">
          Assigned to: {task.assignedUser.firstName}{" "}
          {task.assignedUser.lastName}
        </p>
      )}

      {/*
       * Owner and Assigned can change the status
       */}
      {(isOwner || isAssignee) && (
        <select
          className="input mt-3"
          value={task.status}
          onChange={(e) => onStatusChange(e.target.value)}
        >
          <option value="TODO">TODO</option>
          <option value="IN_PROGRESS">IN PROGRESS</option>
          <option value="DONE">DONE</option>
        </select>
      )}

      {/*
       * Owner can edit the task
       */}
      {isOwner && (
        <div className="flex justify-end mt-4">
          <button className="btn" onClick={onEdit}>
            Edit
          </button>
        </div>
      )}
    </Modal>
  );
}
