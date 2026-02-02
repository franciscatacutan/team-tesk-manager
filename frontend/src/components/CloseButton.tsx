type Props = {
  onClick: () => void;
  className?: string;
};

/*
 * A reusable close button component
 */
export default function CloseButton({ onClick, className = "" }: Props) {
  return (
    <button
      aria-label="Close"
      onClick={onClick}
      className={`
        inline-flex items-center justify-center
        w-9 h-9
        rounded-full
        text-gray-500
        hover:text-gray-700
        hover:bg-gray-100
        focus:outline-none
        focus:ring-2 focus:ring-gray-300
        transition
        ${className}
      `}
    >
      <span className="text-xl leading-none">×</span>
    </button>
  );
}
