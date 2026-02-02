import Button from "../components/Button";
import Modal from "../components/Modal";
import type { Task } from "./task.types";

type Props = {
  task: Task | null;
  isOwner: boolean;
  isAssignee: boolean;
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
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
  onDelete,
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

      <div className="flex justify-end gap-2 mt-4">
        {/*
         * Owner can delete task
         */}
        {isOwner && (
          <Button size="lg" onClick={onDelete} variant="danger">
            DELETE
          </Button>
        )}

        {/*
         * Owner can edit the task
         */}
        {isOwner && (
          <Button size="lg" onClick={onEdit} variant="secondary">
            EDIT
          </Button>
        )}
      </div>
    </Modal>
  );
}
