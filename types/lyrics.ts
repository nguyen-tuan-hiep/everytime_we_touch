export interface LyricLine { time: number; text: string; section?: string }
export interface SongData { title: string; artist?: string; audio: string; timingStatus?: string; lyrics: LyricLine[] }
