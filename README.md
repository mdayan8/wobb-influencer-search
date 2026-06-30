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
- **Dashboard**: Card grid with avatar, name, follower count, and hover effects. "Add" button on each card
- **Platform filter**: Pill-style tabs with platform icons (Instagram, YouTube, TikTok via lucide-react)
- **Search**: Rounded search bar with search icon and clear button
- **Profile detail**: Full-width profile page with gradient banner, avatar overlay, stats grid with icons, and Visit Profile link
- **Selected list panel**: 
  - **Desktop**: Persistent right sidebar (320-384px wide)
  - **Mobile**: Slide-in overlay panel with backdrop blur
- **Responsive**: Flexbox layout, sidebar hides on mobile, toggle button shows panel
- **Dark mode**: Full dark mode support via Tailwind `dark:` classes (system preference or manual toggle)

### 3. Zustand State Management

Created `src/stores/useProfileStore.ts` with:
- `selectedProfiles: UserProfileSummary[]` — persistent via `zustand/middleware/persist` (localStorage)
- `addProfile(profile)` — prevents duplicates by `user_id`
- `removeProfile(userId)` — removes from list
- `isInList(userId)` — check membership
- `clearList()` — empty the entire list

### 4. "Add to List" Feature

- **ProfileCard**: "Add" button on each card, toggles to "Added" with checkmark when in list
- **ProfileDetailPage**: "Add to List" / "Added to List" button with visual state change
- **SelectedListPanel**: Shows all selected profiles with avatar, name, follower count. Remove (X) button per profile. Clear All button. Click profile to navigate to detail page.
- **Persistence**: List survives page refresh via localStorage

### 5. Code Quality

- **Folder structure**: `components/`, `pages/`, `stores/`, `types/`, `utils/`
- **Reusable components**: `SearchBar`, `VerifiedBadge`, `SelectedListPanel`, `ProfileCard`
- **TypeScript**: No `any` types, proper interfaces for all props and state
- **React best practices**: `useReducer` for complex state, `useCallback`/`useMemo` for performance, `memo` for list items

### 6. Performance Optimizations

- `React.memo` on `ProfileCard` (list rendering)
- `useMemo` for filtered profiles and extracted profiles
- `useCallback` for all event handlers passed as props
- Cleanup function in `useEffect` to prevent state updates on unmounted components
- Code splitting via Vite's dynamic imports for profile JSON data

### 7. Accessibility

- `alt` text on all images
- `aria-label` on all buttons and interactive elements
- `role="link"` and `tabIndex` on clickable cards for keyboard navigation
- `aria-pressed` on platform filter buttons
- Focus-visible ring indicators
- Semantic HTML structure

### 8. Bonus

- **Animations**: Framer Motion for panel slide-in/out transitions
- **Dark mode**: Full dark mode support (respects system preference)
- **Fonts**: Inter font via Google Fonts for modern typography
- **Custom scrollbar**: Styled webkit scrollbar for a polished feel

## Libraries Added

| Library | Purpose | Size |
|---------|---------|------|
| `zustand` | State management with localStorage persistence | ~3KB |
| `lucide-react` | Modern icon library (tree-shakeable) | ~15KB |
| `framer-motion` | Animations (panel transitions) | ~30KB |
| `clsx` | Conditional className utility | ~1KB |

## Assumptions

1. **No existing React Context to replace**: The starter codebase didn't use React Context, so Zustand was implemented fresh for the selected list feature.
2. **Static data**: All data is local JSON — no API calls needed. Profile loading uses Vite's `import.meta.glob` for code splitting.
3. **Platform in URL**: Kept the `?platform=` query param for profile detail pages since it's used in the navigation.
4. **Dark mode via Tailwind**: Used Tailwind's `dark:` class strategy rather than the existing CSS variables, as it's more flexible and standard.

## Trade-offs

| Decision | Trade-off |
|----------|-----------|
| Zustand over React Context | Adds a dependency but provides much better DX, persistence middleware, and avoids prop drilling |
| Tailwind dark: over CSS variables | More flexible but required rewriting all styles. Existing CSS variable system was rigid. |
| Framer Motion for animations | Adds ~30KB but provides smooth, performant animations with minimal code |
| No UI component library (shadcn/ui, etc.) | More code to write but shows understanding of Tailwind and avoids "copy-paste" perception |
| `useReducer` over `useState` for profile page | More verbose but avoids the `set-state-in-effect` lint warning and is more scalable |

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
│   ├── SearchBar.tsx        — Search input component
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
