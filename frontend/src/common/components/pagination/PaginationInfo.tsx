interface Props {
  page: number;
  size: number;
  totalElements: number;
}

export function PaginationInfo({ page, size, totalElements }: Props) {
  const start = page * size + 1;
  const end = Math.min((page + 1) * size, totalElements);

  return (
    <div className="text-sm text-muted-foreground">
      Showing {start}–{end} of {totalElements}
    </div>
  );
}
