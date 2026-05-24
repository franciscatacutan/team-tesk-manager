import { PaginationControls } from "./PaginationControls";
import { PageSizeSelector } from "./PageSizeSelector";
import { PaginationInfo } from "./PaginationInfo";

export interface PaginationProps {
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
  onPageChange: (page: number) => void;
  onSizeChange: (size: number) => void;
  options?: number[];
}

export function Pagination({
  page,
  size,
  totalPages,
  totalElements,
  onPageChange,
  onSizeChange,
  options,
}: PaginationProps) {
  return (
    <div className="flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
      <PaginationInfo page={page} size={size} totalElements={totalElements} />

      <div className="flex items-center gap-4">
        <PageSizeSelector
          options={options}
          size={size}
          onChange={onSizeChange}
        />

        <PaginationControls
          page={page}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
}
