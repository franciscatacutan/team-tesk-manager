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
      <h2 className="text-xl font-bold mb-2">Delete Task</h2>

      <p className="text-gray-600 mb-6">
        Are you sure you want to delete this task? This action cannot be undone.
      </p>

      <div className="flex justify-end gap-3">
        <Button size="lg" onClick={onClose} variant="secondary">
          CANCEL
        </Button>

        <Button size="lg" onClick={onConfirm} variant="danger">
          DELETE
        </Button>
      </div>
    </Modal>
  );
}
