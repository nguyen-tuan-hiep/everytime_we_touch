'use client';
import { useEffect, useRef, useState } from 'react';
import { AudioLines, Maximize, Minimize } from 'lucide-react';
import initialSong from '@/data/lyrics.json';
import type { SongData } from '@/types/lyrics';
import { getActiveLyricIndex } from '@/lib/lyrics';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { usePlayerKeyboard } from '@/hooks/usePlayerKeyboard';
import { LyricsView } from './LyricsView';
import { PlayerControls } from './PlayerControls';
export function MusicPlayer() {
  const song: SongData = initialSong;
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  const player = useAudioPlayer();
  usePlayerKeyboard(player);
  const appRef = useRef<HTMLElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [fullscreenError, setFullscreenError] = useState('');

  useEffect(() => {
    const update = () => setIsFullscreen(document.fullscreenElement === appRef.current);
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setExpanded(false);
    };
    document.addEventListener('fullscreenchange', update);
    window.addEventListener('keydown', escape);
    return () => {
      document.removeEventListener('fullscreenchange', update);
      window.removeEventListener('keydown', escape);
    };
  }, []);

  const toggleFullscreen = async () => {
    setFullscreenError('');
    if (expanded) { setExpanded(false); return; }
    try {
      if (document.fullscreenElement === appRef.current) {
        await document.exitFullscreen();
      } else if (document.fullscreenEnabled && appRef.current?.requestFullscreen) {
        await appRef.current.requestFullscreen();
      } else {
        // Browsers without element fullscreen still get an expanded reading view.
        setExpanded(true);
      }
    } catch {
      setFullscreenError('Không thể bật toàn màn hình. Vui lòng thử lại.');
    }
  };
  const fullscreenActive = isFullscreen || expanded;
  return (
    <main
      ref={appRef}
      className={`app${fullscreenActive ? ' fullscreen-mode' : ''}`}
      style={{ backgroundImage: `linear-gradient(180deg, #07151038, #07151075), url("${basePath}/images/background.jpg")` }}
    >
      <audio ref={player.audioRef} src={`${basePath}${song.audio}`} preload="metadata" />
      <div className="player-shell">
        <header className="page-header">
          <div className="song-identity">
            <div className="song-icon"><AudioLines size={24} aria-hidden="true" /></div>
            <div><h1>{song.title}</h1><p>{song.artist}</p></div>
          </div>
          <div className="header-actions">
            <span className="lyrics-badge"><span className="live-dot" /> Lyrics</span>
            <button
              className="fullscreen-button"
              onClick={toggleFullscreen}
              aria-label={fullscreenActive ? 'Thoát toàn màn hình' : 'Toàn màn hình'}
              title={fullscreenActive ? 'Thoát toàn màn hình (Esc)' : 'Toàn màn hình'}
              aria-pressed={fullscreenActive}
            >
              {fullscreenActive ? <Minimize size={19} aria-hidden="true" /> : <Maximize size={19} aria-hidden="true" />}
            </button>
          </div>
        </header>
        {fullscreenError && <div className="error" role="alert">{fullscreenError}</div>}
        {player.error && <div className="error" role="alert">{player.error}<button onClick={player.retry}>Retry</button></div>}
        <LyricsView lyrics={song.lyrics} activeIndex={getActiveLyricIndex(song.lyrics, player.currentTime)} onLyricClick={player.seek} />
        <PlayerControls player={player} />
      </div>
    </main>
  );
}
