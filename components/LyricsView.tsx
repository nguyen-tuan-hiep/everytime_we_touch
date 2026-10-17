'use client';
import { useEffect, useRef, useState } from 'react';
import type { LyricLine } from '@/types/lyrics';
export function LyricsView({ lyrics, activeIndex, onLyricClick }: { lyrics: LyricLine[]; activeIndex: number; onLyricClick: (time: number) => void }) {
  const container = useRef<HTMLDivElement>(null);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [browsing, setBrowsing] = useState(false);
  const follow = () => { if (timer.current) clearTimeout(timer.current); setBrowsing(false); };
  const browse = () => { setBrowsing(true); if (timer.current) clearTimeout(timer.current); timer.current = setTimeout(() => setBrowsing(false), 3000); };
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  useEffect(() => {
    const line = refs.current[Math.max(0, activeIndex)];
    const viewport = container.current;
    if (!browsing && line && viewport) viewport.scrollTo({ top: line.offsetTop - viewport.offsetTop - viewport.clientHeight / 2 + line.clientHeight / 2, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  }, [activeIndex, browsing]);
  return <section className="lyrics-section" aria-label="Song lyrics"><div ref={container} className="lyrics-scroll" onWheel={browse} onTouchMove={browse} onPointerDown={e => { if (e.target === e.currentTarget) browse(); }} onKeyDown={e => { if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End'].includes(e.key)) { e.stopPropagation(); browse(); } }} tabIndex={0} aria-label="Scrollable lyrics"><div className="lyrics-inner">{!lyrics.length && <p>No lyrics yet. Add lines to data/lyrics.json.</p>}{lyrics.map((line, i) => <button ref={el => { refs.current[i] = el; }} key={i} className={`lyric ${i === activeIndex ? 'active' : ''} ${Math.abs(i - activeIndex) <= 1 ? 'near' : ''}`} aria-current={i === activeIndex ? 'true' : undefined} onClick={() => { follow(); onLyricClick(line.time); }}><span className="section-label">{i === 0 || line.section !== lyrics[i - 1].section ? line.section : ''}</span>{line.text}</button>)}</div></div>{browsing && <button className="follow-button" onClick={follow}>Return to current line</button>}</section>;
}
