import type { LyricLine } from '../types/lyrics';
export function getActiveLyricIndex(lyrics: LyricLine[], currentTime: number) {
  for (let i = lyrics.length - 1; i >= 0; i--) if (currentTime >= lyrics[i].time) return i;
  return -1;
}
export function validateTimes(times: (number | null)[], duration: number) {
  return times.every((time, i) => time !== null && Number.isFinite(time) && time >= 0 && (!duration || time <= duration) && (i === 0 || (times[i - 1] !== null && time > times[i - 1]!)));
}
