import React from "react";

type Variant = "primary" | "secondary" | "danger";
type Size = "sm" | "md" | "lg";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  isLoading?: boolean;
};

// BUTTON DESIGN
const baseStyles = `
  inline-flex items-center justify-center
  rounded-lg
  font-medium
  transition
  focus:outline-none
  focus:ring-2 focus:ring-offset-1
  disabled:opacity-60
  disabled:cursor-not-allowed
  min-w-[96px]
`;

const sizeStyles: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-5 py-2.5 text-base",
};

const variants: Record<Variant, string> = {
  primary: `
    bg-blue-600 text-white
    hover:bg-blue-700
    focus:ring-blue-500
  `,
  secondary: `
    border border-gray-300
    text-gray-700
    hover:bg-gray-100
    focus:ring-gray-300
  `,
  danger: `
    bg-red-600 text-white
    hover:bg-red-700
    focus:ring-red-500
  `,
};

/*
 * A reusable button component
 */
export default function Button({
  variant = "primary",
  size = "md",
  isLoading,
  children,
  className = "",
  ...props
}: Props) {
  return (
    <button
      className={`
        ${baseStyles}
        ${sizeStyles[size]}
        ${variants[variant]}
        ${className}
      `}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? "Loading..." : children}
    </button>
  );
}
