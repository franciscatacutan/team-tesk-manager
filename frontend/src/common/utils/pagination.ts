export function getVisiblePages(current: number, total: number) {
  const delta = 1;
  const range: number[] = [];

  for (
    let i = Math.max(0, current - delta);
    i <= Math.min(total - 1, current + delta);
    i++
  ) {
    range.push(i);
  }

  if (current > 1) range.unshift(0);
  if (current < total - 2) range.push(total - 1);

  return [...new Set(range)];
}
