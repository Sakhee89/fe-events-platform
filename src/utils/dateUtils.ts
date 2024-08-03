export const formatDate = (timestamp: string | Date) => {
  if (timestamp instanceof Date) {
    timestamp = timestamp.toISOString();
  }

  const result = timestamp.split("T")[0];
  return result;
};

export const formatTime = (timestamp: string) => {
  const date = new Date(timestamp);
  return Number(date.getHours() - 1);
};

export const convertDate = (currentDate: string, newDate: string): string => {
  const [year, month, day] = newDate.split("-");

  const date = new Date(currentDate);
  date.setDate(Number(day));
  date.setMonth(Number(month) - 1);
  date.setFullYear(Number(year));

  return date.toISOString();
};

export const convertHour = (currentDate: string, newHour: string): string => {
  const date = new Date(currentDate);
  date.setHours(Number(newHour) + 1);

  return date.toISOString();
};
