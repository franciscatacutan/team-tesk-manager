import type { ReactNode } from "react";
import { useEffect } from "react";
import CloseButton from "./CloseButton";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
};

/*
 * A reusable modal component.
 */
export default function Modal({ isOpen, onClose, children }: Props) {
  // Close on ESC key
  useEffect(() => {
    if (!isOpen) return;

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="
        fixed inset-0 z-50
        flex items-center justify-center
      "
    >
      {/*Close onClick on Backdrop */}
      <div
        className="
          absolute inset-0
          bg-black/40
        "
        onClick={onClose}
      />

      {/* Modal Card */}
      <div
        className="
          relative
          bg-white
          rounded-xl
          shadow-lg
          w-full max-w-md
          p-6
          z-10
          animate-fadeIn
        "
      >
        {/* Close Button */}
        <CloseButton
          className="absolute top-3 right-3"
          onClick={onClose}
        ></CloseButton>
        {children}
      </div>
    </div>
  );
}
