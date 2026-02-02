import Button from "../components/Button";
import Modal from "../components/Modal";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
};
/*
 * Delete Project Modal
 */
export default function ConfirmDeleteProjectModal({
  isOpen,
  onClose,
  onConfirm,
}: Props) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-xl font-bold mb-2">Delete Project</h2>

      <p className="text-gray-600 mb-6">
        Are you sure you want to delete this project? All tasks inside this
        project will also be removed.
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
