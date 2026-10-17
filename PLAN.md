# Single-Song Synchronized Lyrics Player

## 1. Project Goal

Build a polished single-page web application that plays one piano track from `music.wav` and displays synchronized lyrics in an Apple Music-inspired interface.

The main experience should be:

- User presses play to start the piano track.
- Lyrics are displayed prominently and are easy to read while singing.
- The currently active lyric line is visually focused.
- Lyrics automatically scroll as playback progresses.
- User can manually scroll through the lyrics.
- Clicking a lyric line seeks the audio directly to that position.
- The UI should work well on both desktop and mobile.
- No backend, authentication, database, playlist, or multi-song support is required.

This project only needs to support one song.

---

# 2. Recommended Tech Stack

Use:

- Next.js 16
- React
- TypeScript
- Tailwind CSS
- lucide-react
- Native `HTMLAudioElement`

Do not introduce unnecessary audio libraries unless there is a concrete technical reason.

Native browser audio APIs are sufficient for:

- playback
- pause
- seeking
- duration
- current playback time
- volume

---

# 3. Scope

## In Scope

Implement:

- Single audio track
- Synchronized line-level lyrics
- Play / pause
- Audio progress bar
- Seeking
- Current time / duration
- Click lyric to seek
- Automatic lyric highlighting
- Automatic lyric scrolling
- Manual lyric scrolling
- Temporary suspension of auto-scroll while user is browsing lyrics
- Responsive desktop/mobile UI
- Keyboard controls
- Optional lyric synchronization/edit mode
- Export synchronized lyrics as JSON

## Out of Scope

Do NOT implement:

- Authentication
- Database
- Backend API
- Multiple songs
- Playlist
- Spotify API
- Apple Music API
- User accounts
- Automatic speech recognition
- AI transcription
- Automatic lyric detection
- Web Audio API processing
- Audio waveform analysis
- Cloud storage
- Admin dashboard

Avoid over-engineering the application.

---

# 4. Suggested Project Structure

```text
music-lyrics/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
│
├── components/
│   ├── MusicPlayer.tsx
│   ├── LyricsView.tsx
│   ├── PlayerControls.tsx
│   ├── ProgressBar.tsx
│   └── SyncEditor.tsx
│
├── hooks/
│   └── useAudioPlayer.ts
│
├── lib/
│   ├── lyrics.ts
│   └── time.ts
│
├── data/
│   └── lyrics.json
│
├── public/
│   └── audio/
│       └── music.wav
│
└── types/
    └── lyrics.ts
```

---

# 5. Audio Asset

The audio file will be located at:

```text
public/audio/music.wav
```

Use a native audio element:

```tsx
<audio
  ref={audioRef}
  src="/audio/music.wav"
  preload="metadata"
/>
```

The audio element itself does not need to be visually displayed.

---

# 6. Lyrics Data Format

Lyrics must not be stored as plain strings only.

Every lyric line must contain a timestamp.

Recommended format:

```json
{
  "title": "Song Title",
  "artist": "",
  "audio": "/audio/music.wav",
  "lyrics": [
    {
      "time": 8.42,
      "text": "First lyric line"
    },
    {
      "time": 13.75,
      "text": "Second lyric line"
    },
    {
      "time": 19.2,
      "text": "Third lyric line"
    }
  ]
}
```

All timestamps use seconds.

Example:

```text
01:24.500
```

becomes:

```text
84.5
```

---

# 7. TypeScript Types

Create a lyric type similar to:

```ts
export interface LyricLine {
  time: number
  text: string
}
```

Optional extended version:

```ts
export interface LyricLine {
  id: number
  time: number
  endTime?: number
  text: string
}
```

Song metadata can use:

```ts
export interface SongData {
  title: string
  artist?: string
  audio: string
  lyrics: LyricLine[]
}
```

---

# 8. Audio Player Architecture

Create a reusable hook:

```text
useAudioPlayer()
```

The hook should expose at least:

```ts
audioRef
currentTime
duration
isPlaying
volume
```

Actions:

```ts
play()
pause()
togglePlay()
seek(time)
skipForward(seconds)
skipBackward(seconds)
setVolume(volume)
```

Listen to native audio events such as:

```text
loadedmetadata
timeupdate
play
pause
ended
```

Do not create unnecessary timers if native audio events are sufficient.

If lyric updates later feel visually too slow, playback UI updates may use `requestAnimationFrame` while audio is playing.

---

# 9. Active Lyric Detection

Create a pure helper function:

```ts
function getActiveLyricIndex(
  lyrics: LyricLine[],
  currentTime: number
): number
```

Expected logic:

```ts
export function getActiveLyricIndex(
  lyrics: LyricLine[],
  currentTime: number
) {
  for (let i = lyrics.length - 1; i >= 0; i--) {
    if (currentTime >= lyrics[i].time) {
      return i
    }
  }

  return 0
}
```

The current lyric is the latest lyric whose timestamp is less than or equal to the current audio position.

For this project, a simple linear search is sufficient.

Do not introduce binary search unless necessary.

---

# 10. Lyrics Interface

The lyrics should be the primary visual element of the page.

Each lyric line must be clickable.

Example:

```tsx
<button
  onClick={() => seek(line.time)}
>
  {line.text}
</button>
```

Clicking a lyric should seek the audio to that lyric's timestamp.

---

# 11. Lyric Visual States

Use different visual states depending on proximity to the current lyric.

## Active Lyric

The current line should have:

```text
high opacity
large font
semibold or bold weight
sharp rendering
strong visual emphasis
```

For example:

```text
opacity: 1
font-weight: 600–700
```

## Nearby Lyrics

Nearby lines can use:

```text
opacity: 0.45–0.65
```

## Distant Lyrics

More distant lines can use:

```text
opacity: 0.2–0.35
```

Avoid making the current lyric dramatically larger than surrounding lyrics because this may cause layout shifts.

Prefer changes in:

- opacity
- font weight
- subtle scale
- subtle transform

---

# 12. Lyric Hover Interaction

On desktop, hovering over a lyric should indicate that it is clickable.

Possible effects:

```text
increase opacity
slight horizontal translation
subtle scale
pointer cursor
```

Do not use excessive animation.

---

# 13. Automatic Lyrics Scrolling

Each lyric line should have a reference.

Example:

```ts
const lyricRefs = useRef<(HTMLButtonElement | null)[]>([])
```

When the active lyric changes:

```ts
lyricRefs.current[activeIndex]?.scrollIntoView({
  behavior: "smooth",
  block: "center",
})
```

The active lyric should usually remain around the vertical center of the lyric viewport.

---

# 14. Manual Scrolling Behavior

Do not force auto-scroll while the user is manually reading another part of the lyrics.

Implement a state similar to:

```ts
isUserScrolling
```

Expected behavior:

```text
Normal playback
    ↓
Active lyric stays centered
    ↓
User manually scrolls lyrics
    ↓
Temporarily disable automatic scrolling
    ↓
User can browse lyrics freely
    ↓
No user scrolling for around 3 seconds
    ↓
Re-enable auto-follow
    ↓
Smoothly scroll back to the active lyric
```

Suggested timeout:

```text
2500–4000 ms
```

A default of approximately:

```text
3000 ms
```

is appropriate.

---

# 15. Click Lyric to Seek

When a lyric line is clicked:

```text
click lyric
    ↓
audio.currentTime = lyric.time
    ↓
active lyric updates
    ↓
lyrics scroll to the selected/current line
```

Important playback rule:

```text
If audio was playing:
    seek and continue playing

If audio was paused:
    seek but remain paused
```

Do not automatically start playback when the user clicks a lyric while paused.

---

# 16. Player Controls

Add a bottom playback control area.

Minimum controls:

```text
current time
progress bar
duration
skip backward
play / pause
skip forward
```

Suggested layout:

```text
01:16  ━━━━━━━━━━━━━●━━━━━━━━━━━━  03:42

             ↶10    ▶    10↷
```

Since there is only one track, do not add:

```text
previous song
next song
shuffle
playlist
```

---

# 17. Progress Bar

The progress bar must:

- update during playback
- show current progress
- support clicking to seek
- support dragging to seek

A native range input is acceptable:

```tsx
<input
  type="range"
  min={0}
  max={duration || 0}
  value={currentTime}
  onChange={(event) => seek(Number(event.target.value))}
/>
```

A custom slider may be implemented if needed for visual polish.

---

# 18. Time Formatting

Create a helper:

```ts
formatTime(seconds)
```

Expected output:

```text
0:00
1:08
3:42
```

Handle invalid values gracefully.

Example:

```ts
export function formatTime(seconds: number) {
  if (!Number.isFinite(seconds)) {
    return "0:00"
  }

  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.floor(seconds % 60)

  return `${minutes}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`
}
```

---

# 19. Keyboard Controls

Support keyboard shortcuts in normal playback mode.

Recommended shortcuts:

```text
Space
Play / Pause

ArrowLeft
Seek backward 5 seconds

ArrowRight
Seek forward 5 seconds

ArrowUp
Increase volume

ArrowDown
Decrease volume
```

Prevent shortcuts from interfering with:

- text inputs
- textareas
- buttons when inappropriate
- synchronization editor controls

---

# 20. Visual Design Direction

Use an Apple Music-inspired lyric experience without copying Apple's exact design.

Desired style:

```text
minimal
dark
immersive
large typography
soft gradients
smooth transitions
high readability
```

Possible background approach:

```text
dark linear gradient
+
large radial gradient
+
subtle ambient glow
```

Do not make the interface visually noisy.

The lyrics should remain the main focus.

---

# 21. Desktop Layout

Preferred desktop experience:

```text
┌────────────────────────────────────────────────┐
│                                                │
│                previous lyric                  │
│                                                │
│                previous lyric                  │
│                                                │
│              CURRENT LYRIC                     │
│                                                │
│                 next lyric                     │
│                                                │
│                 next lyric                     │
│                                                │
│                                                │
├────────────────────────────────────────────────┤
│  01:23    ━━━━━━━━━━━━━●━━━━━━━━━━    03:54    │
│                                                │
│               ↶10    ❚❚    10↷                │
└────────────────────────────────────────────────┘
```

Prefer full-screen lyrics over unnecessary album artwork unless artwork is later provided.

---

# 22. Mobile Layout

Mobile is a priority because the user may use the page while singing.

Suggested layout:

```text
┌────────────────────────┐
│                        │
│    previous lyric      │
│                        │
│    CURRENT LYRIC       │
│                        │
│       next lyric       │
│                        │
│                        │
├────────────────────────┤
│ ━━━━━━━━━●━━━━━━━━     │
│ 1:23             3:55 │
│                        │
│      ↶10  ▶  10↷      │
└────────────────────────┘
```

Playback controls should remain easily reachable.

A fixed or sticky bottom player is appropriate.

Add enough bottom padding to the lyrics container so the controls never cover lyrics.

---

# 23. Animation Guidelines

Animations should be subtle.

Good properties to animate:

```text
opacity
transform
filter
```

Example:

```css
transition:
  opacity 300ms ease,
  transform 300ms ease;
```

Avoid:

```text
large bouncing animations
large scale changes
heavy blur
constant motion
```

The website is intended for reading lyrics while singing, so readability is more important than visual effects.

---

# 24. Accessibility

Implement basic accessibility.

Use semantic HTML such as:

```text
button
input
main
section
```

Add labels such as:

```tsx
aria-label="Play"
aria-label="Pause"
aria-label="Seek backward 10 seconds"
aria-label="Seek forward 10 seconds"
```

Lyrics should be keyboard accessible where reasonable.

Respect:

```css
prefers-reduced-motion
```

Avoid relying only on color to communicate the active lyric.

---

# 25. Lyric Synchronization / Edit Mode

The initial project only has:

```text
music.wav
+
plain lyrics
```

Therefore, timestamps must be created.

Add an optional synchronization mode to make timestamp creation easy.

A simple route/query approach is acceptable:

```text
/?edit=true
```

or:

```text
/sync
```

---

# 26. Synchronization Editor UX

The editor should display:

```text
audio player

current playback time

current lyric waiting to be marked

already synchronized lyrics

unsynchronized lyrics
```

Example:

```text
Current time: 00:12.380

[Space] Mark current lyric

> First lyric       00:08.420
  Second lyric      00:12.380
  Third lyric       --
  Fourth lyric      --
```

---

# 27. Timestamp Marking Workflow

Expected workflow:

```text
1. Start playing music.

2. When the musical position corresponding to a lyric line begins,
   press Space.

3. Store:

   current audio time
   ↓
   current lyric timestamp

4. Automatically select the next lyric.

5. Continue until all lyrics are synchronized.
```

The editor should allow correcting mistakes.

At minimum support:

```text
edit timestamp
delete timestamp
re-mark timestamp
seek to timestamp
```

---

# 28. Sync Mode Keyboard Behavior

Normal mode:

```text
Space
→ Play / Pause
```

Synchronization mode:

```text
Space
→ Mark timestamp for current lyric
```

Make sure these modes do not conflict.

Provide a separate play/pause key or button in synchronization mode if necessary.

---

# 29. Export Lyrics

After synchronization, provide an export action.

Export as JSON using the same format consumed by the player.

Example:

```json
{
  "title": "Song Title",
  "audio": "/audio/music.wav",
  "lyrics": [
    {
      "time": 8.42,
      "text": "First lyric"
    },
    {
      "time": 13.76,
      "text": "Second lyric"
    }
  ]
}
```

A simple:

```text
Copy JSON
```

button is sufficient.

Optional:

```text
Download lyrics.json
```

can also be implemented.

---

# 30. Future-Proof Lyrics Schema

Version 1 only requires line-level synchronization.

However, avoid structuring the code in a way that prevents future word-level karaoke.

Future format may look like:

```ts
{
  time: 22.1,
  text: "Ngày hôm ấy",
  words: [
    {
      text: "Ngày",
      time: 22.1
    },
    {
      text: "hôm",
      time: 22.45
    },
    {
      text: "ấy",
      time: 22.8
    }
  ]
}
```

Do not implement word-level karaoke now.

Only keep the architecture reasonably extensible.

---

# 31. State Flow

The main application data flow should remain simple.

```text
music.wav
    ↓
HTMLAudioElement
    ↓
currentTime
    ↓
getActiveLyricIndex()
    ↓
LyricsView
    ↓
highlight current lyric
    ↓
auto-scroll current lyric
```

Clicking a lyric creates the reverse interaction:

```text
LyricsView
    ↓
click lyric
    ↓
seek(lyric.time)
    ↓
HTMLAudioElement
    ↓
currentTime updates
```

Avoid global state libraries unless clearly needed.

React state, refs, and custom hooks should be sufficient.

---

# 32. Suggested Component Responsibilities

## `MusicPlayer.tsx`

Responsible for:

- page-level audio player composition
- connecting lyrics and audio state
- arranging lyrics and playback controls

---

## `LyricsView.tsx`

Responsible for:

- rendering lyrics
- active lyric styling
- lyric click handling
- lyric auto-scroll
- manual-scroll detection

Props may include:

```ts
lyrics
activeIndex
onLyricClick
```

---

## `PlayerControls.tsx`

Responsible for:

- play/pause
- skip backward
- skip forward
- time labels
- volume if included

---

## `ProgressBar.tsx`

Responsible for:

- playback progress
- seeking
- drag behavior

---

## `SyncEditor.tsx`

Responsible for:

- timestamp creation
- current lyric selection
- correcting timestamps
- JSON export

---

## `useAudioPlayer.ts`

Responsible for:

- native audio element state
- playback methods
- current time
- duration
- volume
- event listeners

---

# 33. Error Handling

Handle basic errors gracefully.

Examples:

```text
audio file cannot load
lyrics file is empty
duration unavailable
invalid timestamp
timestamp outside audio duration
```

Do not crash the application.

Display a concise error state if the audio cannot be loaded.

---

# 34. Performance

The song only contains a normal number of lyric lines, so optimize for simplicity instead of premature performance tuning.

Avoid unnecessary:

- global state
- virtualization
- binary search
- complex memoization
- Web Workers
- audio processing

Use memoization only when there is a measurable reason.

---

# 35. Definition of Done

The project is complete when all of the following work.

## Audio

- [ ] `music.wav` loads successfully
- [ ] Play works
- [ ] Pause works
- [ ] Current playback time updates
- [ ] Duration displays correctly
- [ ] Skip backward works
- [ ] Skip forward works
- [ ] Progress bar updates during playback
- [ ] Progress bar supports seeking

## Lyrics

- [ ] Lyrics load from structured data
- [ ] Correct lyric line is detected from `currentTime`
- [ ] Current lyric is clearly highlighted
- [ ] Previous and next lyrics are visually de-emphasized
- [ ] Lyrics automatically follow playback
- [ ] Active lyric remains near the center of the screen
- [ ] Clicking a lyric seeks audio to its timestamp

## Manual Scroll

- [ ] User can manually scroll through lyrics
- [ ] Auto-follow temporarily stops while the user scrolls
- [ ] Auto-follow resumes after the user stops interacting
- [ ] Returning to the current lyric is smooth

## Player UX

- [ ] Keyboard play/pause works
- [ ] Keyboard seek works
- [ ] Mobile controls are usable
- [ ] Desktop controls are usable
- [ ] Player does not obscure lyrics

## Visual Quality

- [ ] Active lyric is easy to read while singing
- [ ] Animations are subtle
- [ ] No major layout shifts occur when active lyric changes
- [ ] Responsive design works on common mobile widths
- [ ] Responsive design works on desktop

## Sync Editor

- [ ] User can play the audio while synchronizing lyrics
- [ ] User can assign timestamps to lyrics
- [ ] User can correct timestamps
- [ ] User can seek to an existing timestamp
- [ ] User can export the final synchronized lyrics as JSON

---

# 36. Implementation Order

Implement the project in the following order.

## Phase 1 — Basic Setup

1. Initialize Next.js project.
2. Configure Tailwind CSS.
3. Add `music.wav`.
4. Add initial lyric data.
5. Create base full-screen layout.

## Phase 2 — Audio Player

1. Add hidden/native audio element.
2. Implement `useAudioPlayer`.
3. Implement play/pause.
4. Implement duration/current time.
5. Implement seeking.
6. Implement progress bar.

## Phase 3 — Lyrics Synchronization

1. Render lyrics.
2. Implement active lyric detection.
3. Highlight current lyric.
4. Implement click-to-seek.

## Phase 4 — Auto Scroll

1. Create refs for lyric lines.
2. Auto-center active lyric.
3. Detect manual scrolling.
4. Temporarily disable auto-follow.
5. Restore auto-follow.

## Phase 5 — UI Polish

1. Add dark gradient background.
2. Improve typography.
3. Add lyric state transitions.
4. Polish player controls.
5. Improve responsive behavior.
6. Add accessibility labels.

## Phase 6 — Sync Editor

1. Add synchronization route/mode.
2. Allow timestamp marking.
3. Add timestamp corrections.
4. Add JSON preview.
5. Add JSON export/copy.

## Phase 7 — QA

Test:

- desktop
- mobile
- keyboard
- long lyrics
- fast seeking
- repeated lyric clicking
- playback ending
- manual scroll behavior
- browser refresh

---

# 37. Important Engineering Principles

Keep the implementation:

```text
simple
maintainable
typed
componentized
responsive
accessible
```

Avoid unnecessary abstractions.

Do not introduce a complex architecture for a single-song website.

The most important parts of the project are:

1. Accurate lyric synchronization
2. Smooth lyric following
3. Click-to-seek
4. Readability while singing
5. Good manual-scroll behavior

Prioritize those before decorative features.

---

# Agent Handoff Prompt

Use this short prompt with Codex, Claude Code, or another coding agent:

```text
Read PLAN.md carefully and implement the project phase by phase.
Do not over-engineer or add features outside the defined scope.
Start by inspecting the existing repository before changing anything.
```
