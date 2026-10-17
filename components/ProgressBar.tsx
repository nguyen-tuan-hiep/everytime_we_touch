import { formatTime } from '@/lib/time';
export function ProgressBar({ currentTime, duration, seek }: { currentTime: number; duration: number; seek: (time: number) => void }) {
  return <div className="progress"><input aria-label="Playback position" aria-valuetext={`${formatTime(currentTime)} of ${formatTime(duration)}`} type="range" min="0" max={duration || 1} step="0.01" value={Math.min(currentTime, duration || 0)} disabled={!duration} onChange={e => seek(Number(e.target.value))} style={{ background: `linear-gradient(to right, var(--accent) ${duration ? currentTime / duration * 100 : 0}%, var(--track) 0%)` }} /><div className="time-labels"><span>{formatTime(currentTime)}</span><span>{formatTime(duration)}</span></div></div>;
}
