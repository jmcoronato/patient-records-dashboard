## Patient Dashboard

Web application to manage patient information. It lists patients with infinite pagination, lets you mark favorites, and create/edit patients via a validated modal. Favorite and locally created patients are persisted in `localStorage`, and remote patients are fetched from a public API.

### Features

- **Infinite-scroll list**: progressive loading of patients powered by TanStack Query v5 with caching, revalidation, and robust loading/error states.
- **Favorites**: mark/unmark patients as favorites and view them on a dedicated page.
- **Create/edit patients**: modal form with validation using Zod and React Hook Form.
- **Local persistence**: favorites and locally created patients are stored in `localStorage` (via a typed adapter).
- **UI states**: loading skeletons, empty states, error handling, and a “Back to top” button.
- **Routing**: navigation between `Home`, `Patients`, `Favorites`, and `NotFound`.
- **Notifications**: visual feedback via `react-hot-toast`.

### Tech stack

- **Framework**: React 18 + TypeScript
- **Dev server/build**: Vite 5
- **Remote state & fetching**: @tanstack/react-query v5
- **Forms & validation**: react-hook-form + zod
- **Styling**: Tailwind CSS (+ tailwind-merge, tailwindcss-animate)
- **Router**: react-router-dom v6
- **Icons**: lucide-react
- **Toasts**: react-hot-toast
- **Testing**: Vitest, @testing-library/react, jsdom, @vitest/ui, @vitest/coverage-v8
- **Linting**: ESLint (typescript-eslint)

### Project structure

```
patient-dashboard/
├─ src/
│  ├─ components/
│  │  ├─ layouts/            # Page layouts
│  │  ├─ ui/                 # Reusable UI components (Button, Card, Dialog, etc.)
│  │  ├─ PatientCard.tsx     # Patient card component
│  │  ├─ PatientList.tsx     # List with infinite-scroll support
│  │  ├─ PatientModal.tsx    # Create/edit modal
│  │  ├─ ErrorBoundary.tsx   # Error boundary
│  │  ├─ EmptyState.tsx      # Empty state component
│  │  └─ PatientSkeleton.tsx # Loading skeletons
│  ├─ hooks/
│  │  ├─ use-infinite-patients-query.tsx # Infinite pagination logic with React Query
│  │  ├─ use-favorites.tsx               # Toggle and check favorites
│  │  ├─ use-favorite-patients.tsx       # Load/manage favorite patients list
│  │  ├─ use-patient-handlers.tsx        # Orchestrates modal, favorites, and mutations
│  │  └─ use-modal-state.tsx             # Generic modal open/close state
│  ├─ pages/
│  │  ├─ Index.tsx        # Landing page
│  │  ├─ Patients.tsx     # Infinite-scroll listing
│  │  ├─ Favorites.tsx    # Favorites list
│  │  └─ NotFound.tsx
│  ├─ services/
│  │  ├─ api/patientApi.ts       # API client (patients fetch)
│  │  ├─ patientService.ts       # Orchestrates API and storage
│  │  └─ storage/                # Persistence in localStorage (favorites and locals)
│  ├─ schemas/
│  │  └─ patient.schema.ts       # Zod schema for validation
│  ├─ utils/
│  │  └─ storage.ts              # Typed adapter for localStorage
│  ├─ constants/
│  │  └─ app.ts                  # Configs (API, pagination, texts, routes, UI)
│  ├─ types/                     # Domain types (patient, etc.)
│  ├─ App.tsx                    # Providers: React Query + Router + Toaster
│  └─ main.tsx                   # App bootstrap
├─ tests/coverage/...            # Coverage report (generated)
├─ vite.config.ts, tsconfig*.json, eslint.config.js, tailwind.config.ts
└─ package.json
```

### Key configuration

- **API**: configurable in `src/constants/app.ts` via `API_CONFIG.BASE_URL` (default mock API) and `API_CONFIG.TIMEOUT`.
- **Pagination**: `PAGINATION.ITEMS_PER_PAGE` controls page size for infinite scroll.
- **UI**: toast position and skeleton counts in `UI_CONFIG`.
- **Storage keys**: defined in `STORAGE_KEYS` for favorites and local patients.

### Requirements

- Node.js 18+ recommended.

### Installation and usage

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Linting
npm run lint

# Tests
npm run test           # CLI mode
npm run test:ui        # interactive UI
npm run test:coverage  # generates report in ./coverage

# Build and preview
npm run build
npm run preview
```

### Architecture notes

- The `use-infinite-patients-query` hook uses `useInfiniteQuery` to merge local patients (only on the first page) with remote ones while avoiding duplicates.
- `use-patient-handlers` centralizes modal and favorites actions and delegates saving to React Query mutations.
- Local storage uses a typed `StorageAdapter<T>` to perform safe operations over `localStorage`.
