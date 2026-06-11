export function buildUpdateSet(data: Record<string, unknown>, startIndex = 1) {
  const keys = Object.keys(data).filter((k) => data[k] !== undefined);
  const clause = keys.map((k, i) => `"${k}" = $${startIndex + i}`).join(", ");
  const values = keys.map((k) => data[k]);
  return { clause, values, nextIndex: startIndex + keys.length, isEmpty: keys.length === 0 };
}
