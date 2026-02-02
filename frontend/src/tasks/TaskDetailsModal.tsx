import { useEffect, useState } from "react";
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
  onStatusChange: (status: "TODO" | "IN_PROGRESS" | "DONE") => void;
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

  // Local status for immediate UI updates
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [status, setStatus] = useState<"TODO" | "IN_PROGRESS" | "DONE">(
    task.status,
  );

  // Sync when task changes
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    setStatus(task.status);
  }, [task]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
          {task.title}
        </h2>

        {task.description?.trim() && (
          <p className="mt-2 text-sm leading-relaxed text-gray-600">
            {task.description}
          </p>
        )}
      </div>

      {/* Metadata */}
      <div className="mb-4 space-y-2 text-sm text-gray-500">
        {task.assignedUser && (
          <div>
            Assigned to{" "}
            <span className="font-medium text-gray-700">
              {task.assignedUser.firstName} {task.assignedUser.lastName}
            </span>
          </div>
        )}
      </div>

      {/* Status */}
      {(isOwner || isAssignee) && (
        <div className="mb-6 space-y-1">
          <label className="text-sm font-medium text-gray-700">Status</label>

          <select
            className="input"
            value={status}
            onChange={(e) => {
              const newStatus = e.target.value as
                | "TODO"
                | "IN_PROGRESS"
                | "DONE";

              setStatus(newStatus);
              onStatusChange(newStatus);
            }}
          >
            <option value="TODO">To do</option>
            <option value="IN_PROGRESS">In progress</option>
            <option value="DONE">Done</option>
          </select>
        </div>
      )}

      {/* Footer */}
      <div className="flex justify-end gap-2 border-t pt-4">
        {isOwner && (
          <Button type="button" size="md" variant="secondary" onClick={onEdit}>
            Edit
          </Button>
        )}

        {isOwner && (
          <Button type="button" size="md" variant="danger" onClick={onDelete}>
            Delete
          </Button>
        )}
      </div>
    </Modal>
  );
}
