export function formatDate(dateString: string): string {
  const date = new Date(dateString + "T00:00:00");
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function isUpcoming(dateString: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const showDate = new Date(dateString + "T00:00:00");
  return showDate >= today;
}
