# Wobb Influencer Search — Assignment Submission

A redesigned influencer search application built with **React 19**, **TypeScript**, **Vite**, **Tailwind CSS 4**, and **Zustand**.

**Live URL:** https://wobb-assignment-wheat.vercel.app

## What Changed

### 1. Bug Fixes (14 issues resolved)

| Bug | Fix |
|-----|-----|
| Username search was case-sensitive (`p.username.includes(query)`) | Added `.toLowerCase()` to both sides of the comparison |
| Engagement rate multiplied by 10000 instead of 100 | Changed to `* 100` for correct percentage display |
| "Engagements" label showed engagement rate | Changed label to "Total Engagements" and uses raw count |
| Stale closure in `handleProfileClick` (`setClickCount(clickCount + 1)`) | Removed dead code entirely — `clickCount` served no purpose |
| Duplicate local `formatFollowers` functions in ProfileCard and ProfileDetailPage | Unified to use shared `formatFollowers` from `formatters.ts` |
| `data-search={searchQuery}` exposed search query in DOM | Removed unnecessary prop drilling |
| Duplicate TODO comments in ProfileCard and ProfileDetailPage | Cleaned up |
| `react-beautiful-dnd` in dependencies but never used (also incompatible with React 19) | Removed |
| No `alt` text on any `<img>` tags | Added descriptive alt text everywhere |
| No `aria-label` on buttons/inputs | Added aria-labels to all interactive elements |
| No error handling in `loadProfileByUsername` | Added try/catch with proper error state |
| No 404/catch-all route | Added `*` route with styled 404 page |
| Fixed `#root` width of 1126px preventing responsive layout | Removed, using Tailwind responsive utilities |
| `react-hooks/set-state-in-effect` lint error | Refactored to `useReducer` pattern with proper cancellation |

### 2. UI/UX Redesign

- **Layout**: Gradient background, sticky header with blur effect, clean card-based design
- **Dashboard**: Card grid with avatar, name, follower count, engagement rate, and hover effects
- **Platform filter**: Pill-style tabs with platform icons (Instagram, YouTube, TikTok via lucide-react)
- **Search**: Real-time search suggestions with dropdown showing profiles, recent searches, and trending
- **Profile detail**: Full-width profile page with gradient banner, avatar overlay, stats grid with icons, and Visit Profile link
- **Selected list panel**: 
  - **Desktop**: Persistent right sidebar (320-384px wide)
  - **Mobile**: Slide-in overlay panel with backdrop blur
- **Responsive**: Flexbox layout, sidebar hides on mobile, toggle button shows panel
- **Dark mode**: Full dark mode support via Tailwind `dark:` classes

### 3. Data (50+ Influencer Profiles)

**Instagram (20 profiles):**
Instagram, Cristiano Ronaldo, Leo Messi, Selena Gomez, Kylie Jenner, Dwayne Johnson, Ariana Grande, Kim Kardashian, Beyoncé, Khloé Kardashian, National Geographic, Nike, NASA, FC Barcelona, Narendra Modi, Virat Kohli, Mark Zuckerberg, Addison Rae, Zach King, Theresa XO

**YouTube (16 profiles):**
MrBeast, T-Series, CoComelon, SET India, PewDiePie, Kids Diana Show, Peppa Pig, Whinderssonnunes, El Rubius, CarryMinati, Ashish Chanchlani, BB Ki Vines, Triggered Insaan, Tech Burner, Maniesuper, T-Series Music

**TikTok (16 profiles):**
Khaby Lame, Charli D'Amelio, MrBeast, Bella Poarch, Addison Rae, Zach King, Loren Gray, Spencer X, Dobre Twins, Will Smith, Gordon Ramsay, Nyobi, David Dobrik, Jason Derulo, Khaby Lame Extra, WWE

### 4. Zustand State Management

Created `src/stores/useProfileStore.ts` with:
- `selectedProfiles: UserProfileSummary[]` — persistent via `zustand/middleware/persist` (localStorage)
- `followedProfiles: Record<string, boolean>` — follow state per user, persisted to localStorage
- `addProfile(profile)` — prevents duplicates by `user_id`
- `removeProfile(userId)` — removes from list
- `isInList(userId)` — check membership
- `clearList()` — empty the entire list
- `toggleFollow(userId)` — follow/unfollow a profile
- `isFollowing(userId)` — check follow status

### 5. Features

**Add to List:**
- "Add" button on each profile card, toggles to "Added" with checkmark
- "Add to List" / "Added to List" button on profile detail page
- SelectedListPanel shows all selected profiles with remove (X) and follow buttons
- Clear All button in panel header
- List persists across page refresh via localStorage

**Follow System:**
- Follow/Unfollow button on every profile card
- Follow status indicator (ring badge on avatar when following)
- Follow button on profile detail page
- Follow toggle in selected list panel
- Follow count displayed in dashboard stats

**Real-time Search:**
- Search dropdown with profile suggestions (shows avatar, name, followers, verified badge)
- Recent searches with localStorage persistence (shows last 5 searches)
- Trending profiles section (top 5 by follower count)
- Clear recent searches button
- "No results" state for empty searches

### 6. Code Quality

- **Folder structure**: `components/`, `pages/`, `stores/`, `types/`, `utils/`
- **Reusable components**: `SearchBar`, `VerifiedBadge`, `SelectedListPanel`, `ProfileCard`
- **TypeScript**: No `any` types, proper interfaces for all props and state
- **React best practices**: `useReducer` for complex state, `useCallback`/`useMemo` for performance, `memo` for list items

### 7. Performance Optimizations

- `React.memo` on `ProfileCard` and `SelectedListPanel`
- `useMemo` for filtered profiles, extracted profiles, suggestions, and trending
- `useCallback` for all event handlers passed as props
- Cleanup function in `useEffect` to prevent state updates on unmounted components
- Code splitting via Vite's dynamic imports for profile JSON data

### 8. Accessibility

- `alt` text on all images
- `aria-label` on all buttons and interactive elements
- `role="link"` and `tabIndex` on clickable cards for keyboard navigation
- `aria-pressed` on platform filter buttons
- `role="combobox"` and `aria-autocomplete` on search input
- Focus-visible ring indicators
- Semantic HTML structure

### 9. Bonus

- **Animations**: Framer Motion for panel slide-in/out and search dropdown transitions
- **Dark mode**: Full dark mode support (respects system preference)
- **Fonts**: Inter font via Google Fonts for modern typography
- **Custom scrollbar**: Styled webkit scrollbar for a polished feel

## Libraries Added

| Library | Purpose | Size |
|---------|---------|------|
| `zustand` | State management with localStorage persistence | ~3KB |
| `lucide-react` | Modern icon library (tree-shakeable) | ~15KB |
| `framer-motion` | Animations (panel transitions, search dropdown) | ~30KB |
| `clsx` | Conditional className utility | ~1KB |

## Assumptions

1. **No existing React Context to replace**: The starter codebase didn't use React Context, so Zustand was implemented fresh for the selected list feature.
2. **Static data**: All data is local JSON — no API calls needed. Profile loading uses Vite's `import.meta.glob` for code splitting.
3. **Platform in URL**: Kept the `?platform=` query param for profile detail pages since it's used in the navigation.
4. **Dark mode via Tailwind**: Used Tailwind's `dark:` class strategy rather than the existing CSS variables, as it's more flexible and standard.
5. **Follow state is separate from selected list**: Following and adding to list are independent features — you can follow without adding, and add without following.

## Trade-offs

| Decision | Trade-off |
|----------|-----------|
| Zustand over React Context | Adds a dependency but provides much better DX, persistence middleware, and avoids prop drilling |
| Tailwind dark: over CSS variables | More flexible but required rewriting all styles. Existing CSS variable system was rigid. |
| Framer Motion for animations | Adds ~30KB but provides smooth, performant animations with minimal code |
| No UI component library (shadcn/ui, etc.) | More code to write but shows understanding of Tailwind and avoids "copy-paste" perception |
| `useReducer` over `useState` for profile page | More verbose but avoids the `set-state-in-effect` lint warning and is more scalable |
| Search suggestions use client-side filtering | Works well for static data; would need debounced API calls for real backend |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build (TypeScript + Vite) |
| `npm run lint` | Run ESLint |

## Project Structure

```
src/
├── components/
│   ├── Layout.tsx           — Main layout with header
│   ├── PlatformFilter.tsx   — Platform tabs + search
│   ├── ProfileCard.tsx      — Individual profile card
│   ├── ProfileList.tsx      — List of profile cards
│   ├── SearchBar.tsx        — Search with suggestions
│   ├── SelectedListPanel.tsx — Selected profiles sidebar
│   └── VerifiedBadge.tsx    — Verification badge icon
├── pages/
│   ├── SearchPage.tsx       — Dashboard / search page
│   └── ProfileDetailPage.tsx — Individual profile view
├── stores/
│   └── useProfileStore.ts   — Zustand store with persistence
├── types/
│   └── index.ts             — TypeScript interfaces
├── utils/
│   ├── dataHelpers.ts       — Data extraction & filtering
│   ├── formatters.ts        — Number formatting utilities
│   └── profileLoader.ts     — Dynamic JSON loading
├── App.tsx                  — Router setup
├── main.tsx                 — Entry point
└── index.css                — Global styles + Tailwind
```
