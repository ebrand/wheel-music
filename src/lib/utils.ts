export function formatDate(dateString: string): string {
  const date = new Date(dateString + "T00:00:00");
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatTime(timeString: string): string {
  const [hoursStr, minutesStr] = timeString.split(":");
  let hours = parseInt(hoursStr, 10);
  const minutes = minutesStr || "00";
  const ampm = hours >= 12 ? "PM" : "AM";
  if (hours === 0) hours = 12;
  else if (hours > 12) hours -= 12;
  return `${hours}:${minutes} ${ampm}`;
}

export function isUpcoming(dateString: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const showDate = new Date(dateString + "T00:00:00");
  return showDate >= today;
}
