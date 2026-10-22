// "Sep 2026" / "sept. 2026": a role's month and year in the page's language.
export const monthYear = (ym, lang = 'en') =>
  new Date(`${ym}-01T00:00:00`).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', { month: 'short', year: 'numeric' });
