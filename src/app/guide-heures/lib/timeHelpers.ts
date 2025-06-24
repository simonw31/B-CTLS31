export function parseHourMinute(time: string): number {
  const [hour, minute] = time.split(':').map(Number);
  return hour + minute / 60;
}
