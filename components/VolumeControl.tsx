'use client';
import { useEffect, useRef } from 'react';
import { Volume1, Volume2, VolumeX } from 'lucide-react';

export function VolumeControl({ volume, setVolume }: { volume: number; setVolume: (volume: number) => void }) {
  const previousVolume = useRef(1);
  useEffect(() => {
    if (volume > 0) previousVolume.current = volume;
  }, [volume]);
  const percentage = Math.round(volume * 100);
  const Icon = volume === 0 ? VolumeX : volume < .5 ? Volume1 : Volume2;

  return (
    <div className="volume" role="group" aria-label="Volume controls">
      <button
        className="volume-mute"
        aria-label={volume === 0 ? 'Unmute' : 'Mute'}
        aria-pressed={volume === 0}
        title={volume === 0 ? 'Unmute' : 'Mute'}
        onClick={() => {
          if (volume > 0) previousVolume.current = volume;
          setVolume(volume === 0 ? previousVolume.current : 0);
        }}
      >
        <Icon size={18} aria-hidden="true" />
      </button>
      <input
        className="volume-slider"
        aria-label="Volume"
        aria-valuetext={`${percentage}%`}
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={volume}
        onChange={event => setVolume(Number(event.target.value))}
        style={{ background: `linear-gradient(to right, var(--accent) ${percentage}%, var(--track) ${percentage}%)` }}
      />
      <span className="volume-value" aria-hidden="true">{percentage}<span>%</span></span>
    </div>
  );
}
