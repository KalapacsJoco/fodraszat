export function formatTime(timeInMinutes: number): string {
    const hours = Math.floor(timeInMinutes / 60);
    const minutes = timeInMinutes % 60;
  
    const hoursStr = hours < 10 ? "0" + hours : hours.toString();
    const minutesStr = minutes < 10 ? "0" + minutes : minutes.toString();
  
    return `${hoursStr}:${minutesStr}`;
  }