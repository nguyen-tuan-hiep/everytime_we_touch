'use client';
import { useEffect, useRef } from 'react';
import { getPlayerShortcut } from '@/lib/keyboard';
import type { useAudioPlayer } from './useAudioPlayer';

export function usePlayerKeyboard(player: ReturnType<typeof useAudioPlayer>) {
  const modality = useRef<'keyboard' | 'pointer'>('keyboard');

  useEffect(() => {
    const onKeyDownCapture = (event: KeyboardEvent) => {
      if (event.key === 'Tab') modality.current = 'keyboard';
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      if (target !== document.body && target !== document.documentElement && !target.closest('main.app')) return;
      const editable = !!target.closest('textarea,select,[contenteditable]:not([contenteditable="false"]),[role="textbox"],input:not([type="range"]):not([type="button"]):not([type="submit"]):not([type="reset"])');
      const range = !!target.closest('input[type="range"],[role="slider"]');
      const action = getPlayerShortcut({
        code: event.code,
        editable,
        nativeRange: range && modality.current === 'keyboard',
        modified: event.altKey || event.ctrlKey || event.metaKey || event.shiftKey,
        composing: event.isComposing,
      });
      if (!action || event.defaultPrevented) return;
      // Capture before buttons/sliders/lyrics handle the key, then cancel their
      // default action so a single key cannot both seek and change volume.
      event.preventDefault();
      event.stopPropagation();
      switch (action) {
        case 'toggle': if (!event.repeat) player.togglePlay(); break;
        case 'backward': player.skipBackward(10); break;
        case 'forward': player.skipForward(10); break;
        case 'volumeUp': player.setVolume((player.audioRef.current?.volume ?? player.volume) + .05); break;
        case 'volumeDown': player.setVolume((player.audioRef.current?.volume ?? player.volume) - .05); break;
      }
    };

    const onPointerDown = () => { modality.current = 'pointer'; };
    window.addEventListener('keydown', onKeyDownCapture, true);
    window.addEventListener('pointerdown', onPointerDown, true);
    return () => {
      window.removeEventListener('keydown', onKeyDownCapture, true);
      window.removeEventListener('pointerdown', onPointerDown, true);
    };
  }, [player]);
}
