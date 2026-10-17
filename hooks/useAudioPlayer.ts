'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
export function useAudioPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, updateVolume] = useState(1);
  const [error, setError] = useState('');
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const time = () => setCurrentTime(audio.currentTime);
    const metadata = () => setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
    const playing = () => { setIsPlaying(true); setError(''); };
    const paused = () => setIsPlaying(false);
    const failed = () => { setError('The audio could not load. Check public/audio/music.wav and retry.'); setIsPlaying(false); };
    const changedVolume = () => updateVolume(audio.volume);
    const events: [string, () => void][] = [['timeupdate', time], ['seeked', time], ['loadedmetadata', metadata], ['durationchange', metadata], ['play', playing], ['pause', paused], ['ended', paused], ['error', failed], ['volumechange', changedVolume]];
    events.forEach(([event, handler]) => audio.addEventListener(event, handler));
    metadata();
    return () => events.forEach(([event, handler]) => audio.removeEventListener(event, handler));
  }, []);
  const play = useCallback(async () => {
    try { await audioRef.current?.play(); } catch { setError('Playback could not start. Press play to try again.'); }
  }, []);
  const pause = useCallback(() => audioRef.current?.pause(), []);
  const togglePlay = useCallback(() => { if (audioRef.current?.paused) void play(); else pause(); }, [play, pause]);
  const seek = useCallback((time: number) => {
    const audio = audioRef.current;
    if (!audio || !Number.isFinite(time) || !Number.isFinite(audio.duration)) return;
    audio.currentTime = Math.max(0, Math.min(audio.duration, time));
    setCurrentTime(audio.currentTime);
  }, []);
  const skipForward = useCallback((seconds: number) => seek((audioRef.current?.currentTime || 0) + seconds), [seek]);
  const skipBackward = useCallback((seconds: number) => skipForward(-seconds), [skipForward]);
  const setVolume = useCallback((value: number) => { if (audioRef.current) audioRef.current.volume = Math.max(0, Math.min(1, value)); }, []);
  const retry = () => { setError(''); audioRef.current?.load(); };
  return { audioRef, currentTime, duration, isPlaying, volume, error, play, pause, togglePlay, seek, skipForward, skipBackward, setVolume, retry };
}
