import { useState } from "react";
import { cn } from "../../lib/utils";
import { Button } from "../../components/ui/button";
import AutoResizeTextareaBase from "./AutoResizeTextareaBase";

interface Props {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onCancel?: () => void;
  placeholder?: string;
  maxLength?: number;
  disabled?: boolean;
  isLoading?: boolean;
}

export default function AutoResizeTextareaForm({
  value,
  onChange,
  onSubmit,
  onCancel,
  placeholder,
  maxLength = 500,
  disabled,
  isLoading,
}: Props) {
  const [focused, setFocused] = useState(false);

  function handleSubmit() {
    if (!value.trim()) return;

    onSubmit();
    setFocused(false);
  }

  return (
    <div
      className={cn(
        "rounded-lg border bg-background px-3 py-2 transition",
        focused && "ring-1 ring-primary",
      )}
    >
      {/* TEXTAREA */}
      <AutoResizeTextareaBase
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        placeholder={placeholder}
        maxLength={maxLength}
        disabled={disabled}
        className="text-sm"
      />

      {/* ACTIONS */}
      {focused && (
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-muted-foreground">
            {value.length} / {maxLength}
          </span>

          <div className="flex gap-2">
            {onCancel && (
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => {
                  setFocused(false);
                  onCancel();
                }}
              >
                Cancel
              </Button>
            )}

            <Button
              size="sm"
              onClick={handleSubmit}
              disabled={!value.trim() || isLoading}
            >
              {isLoading ? "Posting..." : "Post"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
