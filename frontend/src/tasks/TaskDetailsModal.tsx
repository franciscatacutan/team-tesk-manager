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

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [status, setStatus] = useState<"TODO" | "IN_PROGRESS" | "DONE">(
    task.status,
  );

  // Track original status
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [initialStatus, setInitialStatus] = useState(task.status);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (task && isOpen) {
      setStatus(task.status);
      setInitialStatus(task.status);
    }
  }, [task, isOpen]);

  const hasStatusChanged = status !== initialStatus;

  function handleSaveStatus() {
    onStatusChange(status);
    setInitialStatus(status);
  }

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
        <div className="mb-6 space-y-2">
          <label className="text-sm font-medium text-gray-700">Status</label>

          <div className="flex gap-2">
            <select
              className="input flex-1"
              value={status}
              onChange={(e) =>
                setStatus(e.target.value as "TODO" | "IN_PROGRESS" | "DONE")
              }
            >
              <option value="TODO">To do</option>
              <option value="IN_PROGRESS">In progress</option>
              <option value="DONE">Done</option>
            </select>

            <Button
              size="md"
              variant="primary"
              disabled={!hasStatusChanged}
              onClick={handleSaveStatus}
            >
              Save
            </Button>
          </div>
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
