export function parseDateTime(dateStr: string, timeStr: string): Date {
  const dateParts = dateStr.split("/");
  if (dateParts.length !== 3) {
    throw new Error(`Formato de fecha inválido: ${dateStr}. Se esperaba DD/MM/YYYY`);
  }

  const day = parseInt(dateParts[0]);
  const month = parseInt(dateParts[1]) - 1;
  const year = parseInt(dateParts[2]);

  if (day < 1 || day > 31 || month < 0 || month > 11) {
    throw new Error("Fecha inválida: día o mes fuera de rango");
  }

  const cleanedTimeStr = timeStr
    .replace("p. m.", "pm")
    .replace("a. m.", "am")
    .replace(/\s+/g, "");

  const timeMatch = cleanedTimeStr.match(/(\d+):(\d+)(am|pm)/i);
  if (!timeMatch) {
    throw new Error(`Formato de hora inválido: ${timeStr}. Se esperaba hh:mm am/pm`);
  }

  let hour = parseInt(timeMatch[1]);
  const minute = parseInt(timeMatch[2]);
  const amPm = timeMatch[3].toLowerCase();

  if (amPm === "pm" && hour !== 12) hour += 12;
  else if (amPm === "am" && hour === 12) hour = 0;

  return new Date(year, month, day, hour, minute);
}

export const calculatePrice = (hours: number, hourlyRate: number): number => {
  return hours * hourlyRate;
};
