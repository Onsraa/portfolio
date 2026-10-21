// Months between start and end, both counted, as LinkedIn shows them ("1 yr 11 mos").
export function duration(start, end, today = new Date()) {
  const [sy, sm] = start.split('-').map(Number);
  const [ey, em] = end ? end.split('-').map(Number) : [today.getFullYear(), today.getMonth() + 1];
  const n = (ey - sy) * 12 + (em - sm) + 1;
  const y = Math.floor(n / 12), m = n % 12;
  return [y && `${y} yr${y > 1 ? 's' : ''}`, m && `${m} mo${m > 1 ? 's' : ''}`].filter(Boolean).join(' ');
}
