export const isSameDay = (date1: string | Date, date2: string | Date) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  
  return d1.getFullYear() === d2.getFullYear() &&
         d1.getMonth() === d2.getMonth() &&
         d1.getDate() === d2.getDate();
};

export const isPast = (date: string | Date) => {
  const today = new Date();
  // CRITICAL: Reset "Today" to midnight (00:00:00)
  today.setHours(0, 0, 0, 0);

  const target = new Date(date);
  // Reset target to midnight too, just to be safe
  target.setHours(0, 0, 0, 0);

  return target < today;
};