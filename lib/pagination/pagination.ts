export function normalizePagination(
  page?: string | number | null,
  limit?: string | number | null,
) {
  function parse(
    val: string | number | undefined | null,
    fallbackValue: number,
  ) {
    if (val == null) return fallbackValue;
    const n = typeof val === "number" ? val : Number(val);
    if (!Number.isInteger(n) || n <= 0) return fallbackValue;
    return n;
  }

  const safePage = parse(page, 1);
  const safeLimit = Math.min(parse(limit, 10), 50);
  return { safePage, safeLimit };
}
