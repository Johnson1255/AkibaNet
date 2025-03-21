export const getNextQuarterHour = (date: Date) => {
  const minutes = date.getMinutes();
  const nextQuarter = Math.ceil((minutes + 1) / 15) * 15;
  date.setMinutes(nextQuarter);
  let hours = date.getHours();
  const minutes24 = date.getMinutes();
  const ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? hours : 12; // las 0 horas deben ser 12 en formato 12h
  return `${hours.toString().padStart(2, "0")}:${minutes24
    .toString()
    .padStart(2, "0")} ${ampm}`;
};
