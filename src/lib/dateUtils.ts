/**
 * Returns today's date as "YYYY-MM-DD" in LOCAL timezone.
 * Never uses toISOString() which returns UTC and breaks in IST.
 */
export function getTodayLocal(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}