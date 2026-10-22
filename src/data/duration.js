// Dates and lengths of a role, as LinkedIn shows them: months counted inclusively ("1 yr 11 mos" / "1 an 11 mois").
const UNITS = { en: [['yr', 'yrs'], ['mo', 'mos']], fr: [['an', 'ans'], ['mois', 'mois']] };

export function duration(start, end, lang = 'en', today = new Date()) {
  const [sy, sm] = start.split('-').map(Number);
  const [ey, em] = end ? end.split('-').map(Number) : [today.getFullYear(), today.getMonth() + 1];
  const n = (ey - sy) * 12 + (em - sm) + 1;
  const [[y1, yN], [m1, mN]] = UNITS[lang];
  const y = Math.floor(n / 12), m = n % 12;
  return [y && `${y} ${y > 1 ? yN : y1}`, m && `${m} ${m > 1 ? mN : m1}`].filter(Boolean).join(' ');
}

export const monthYear = (ym, lang = 'en') =>
  new Date(`${ym}-01T00:00:00`).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', { month: 'short', year: 'numeric' });
