/**
 * Returns today's date as "YYYY-MM-DD" in LOCAL timezone.
 * Never use toISOString() — it returns UTC and breaks for IST users.
 */
export function getTodayLocal(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}