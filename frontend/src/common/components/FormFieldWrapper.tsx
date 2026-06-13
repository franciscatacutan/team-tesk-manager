import { cn } from "../../lib/utils";

interface Props {
  label?: string;
  error?: string;
  length?: number;
  maxLength?: number;
  children: React.ReactNode;
}

export default function FormField({
  label,
  error,
  length,
  maxLength,
  children,
}: Props) {
  const isNearLimit =
    maxLength !== undefined &&
    length !== undefined &&
    length >= maxLength * 0.9;
  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium text-muted-foreground">
          {label}
        </label>
      )}

      <div
        className={cn(
          "rounded-md border bg-background px-3 py-2 transition",
          "focus-within:ring-1 focus-within:ring-primary",
          error && "border-destructive",
        )}
      >
        {children}
      </div>

      <div className="flex items-center justify-between">
        {error ? (
          <p className="text-xs text-destructive">{error}</p>
        ) : (
          maxLength !== undefined && (
            <span
              className={cn(
                "text-xs",
                isNearLimit ? "text-destructive" : "text-muted-foreground",
              )}
            >
              {length || 0} / {maxLength}
            </span>
          )
        )}
      </div>
    </div>
  );
}
