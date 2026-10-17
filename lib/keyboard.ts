export type PlayerShortcut = 'toggle' | 'backward' | 'forward' | 'volumeUp' | 'volumeDown';

export function getPlayerShortcut({ code, editable = false, nativeRange = false, modified = false, composing = false }: {
  code: string;
  editable?: boolean;
  nativeRange?: boolean;
  modified?: boolean;
  composing?: boolean;
}): PlayerShortcut | null {
  if (editable || modified || composing) return null;
  if (code === 'Space') return 'toggle';
  if (nativeRange) return null;
  switch (code) {
    case 'ArrowLeft': return 'backward';
    case 'ArrowRight': return 'forward';
    case 'ArrowUp': return 'volumeUp';
    case 'ArrowDown': return 'volumeDown';
    default: return null;
  }
}
