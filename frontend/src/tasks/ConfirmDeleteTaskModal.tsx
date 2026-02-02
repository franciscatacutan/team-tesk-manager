import Button from "../components/Button";
import Modal from "../components/Modal";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

/*
 * Delete Task Modal
 */
export default function ConfirmDeleteTaskModal({
  isOpen,
  onClose,
  onConfirm,
}: Props) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
          Delete task
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          This action cannot be undone.
        </p>
      </div>

      {/* Body */}
      <p className="mb-6 text-sm text-gray-600">
        Are you sure you want to permanently delete this task?
      </p>

      {/* Footer */}
      <div className="flex justify-end gap-2 border-t pt-4">
        <Button type="button" size="md" variant="secondary" onClick={onClose}>
          Cancel
        </Button>

        <Button type="button" size="md" variant="danger" onClick={onConfirm}>
          Delete
        </Button>
      </div>
    </Modal>
  );
}
