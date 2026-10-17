import { Pause, Play, RotateCcw, RotateCw } from 'lucide-react';
import { ProgressBar } from './ProgressBar';
import { VolumeControl } from './VolumeControl';
import type { useAudioPlayer } from '@/hooks/useAudioPlayer';
export function PlayerControls({ player }: { player: ReturnType<typeof useAudioPlayer> }) {
  return <footer className="player-controls"><ProgressBar {...player} /><div className="control-row"><span className="shortcut-hint">Space to {player.isPlaying ? 'pause' : 'play'}</span><div className="transport"><button aria-label="Seek backward 10 seconds" onClick={() => player.skipBackward(10)}><span className="skip-icon" aria-hidden="true"><RotateCcw /><small>10</small></span></button><button className="play-button" aria-label={player.isPlaying ? 'Pause' : 'Play'} onClick={player.togglePlay}>{player.isPlaying ? <Pause fill="currentColor" /> : <Play fill="currentColor" />}</button><button aria-label="Seek forward 10 seconds" onClick={() => player.skipForward(10)}><span className="skip-icon" aria-hidden="true"><RotateCw /><small>10</small></span></button></div><VolumeControl volume={player.volume} setVolume={player.setVolume} /></div></footer>;
}
