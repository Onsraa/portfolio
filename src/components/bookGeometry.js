// The spine stays fixed while the free edge bows during a page turn.
export function pagePoint(x, y, turn, width = 1.52) {
  const phase = Math.max(0, Math.min(1, turn));
  const bend = Math.sin(phase * Math.PI) * 0.42;
  return [x, y, Math.sin((x / width) * Math.PI * 0.8) * bend];
}
