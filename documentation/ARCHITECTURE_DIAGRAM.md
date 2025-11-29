# 🏗️ Architecture Overview

## Clean Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         PRESENTATION LAYER                   │
│                        (UI Components)                       │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  Pages (Routes)                                      │    │
│  │  ├── Places.tsx         - List all places           │    │
│  │  ├── CreatePlace.tsx    - Create new place          │    │
│  │  ├── EditPlace.tsx      - Edit existing place       │    │
│  │  ├── PlaceDetail.tsx    - View place details        │    │
│  │  ├── Randomizer.tsx     - Random place picker       │    │
│  │  └── Home.tsx           - Dashboard                 │    │
│  └─────────────────────────────────────────────────────┘    │
│                              ↓                                │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  Components (Reusable UI)                           │    │
│  │  ├── PlaceCard.tsx      - Display place card        │    │
│  │  ├── Layout.tsx         - App layout wrapper        │    │
│  │  └── ui/                - shadcn/ui components      │    │
│  └─────────────────────────────────────────────────────┘    │
└───────────────────────────────────────────────────────────────┘
                               ↓
┌─────────────────────────────────────────────────────────────┐
│                     STATE MANAGEMENT LAYER                   │
│                    (React Query Hooks)                       │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  hooks/usePlaces.ts                                  │    │
│  │                                                       │    │
│  │  Query Hooks (Read Data):                           │    │
│  │  ├── usePlaces(filters)     - List with filters     │    │
│  │  ├── usePlace(id)           - Single place by ID    │    │
│  │  ├── useRandomPlace()       - Random place          │    │
│  │  └── usePlaceStatistics()  - Stats & counts         │    │
│  │                                                       │    │
│  │  Mutation Hooks (Write Data):                       │    │
│  │  ├── useCreatePlace()       - Create new            │    │
│  │  ├── useUpdatePlace()       - Update existing       │    │
│  │  ├── useDeletePlace()       - Delete place          │    │
│  │  └── useToggleFavorite()   - Toggle favorite        │    │
│  │                                                       │    │
│  │  Features:                                           │    │
│  │  ✅ Auto caching                                     │    │
│  │  ✅ Background refetching                            │    │
│  │  ✅ Optimistic updates                               │    │
│  │  ✅ Auto cache invalidation                          │    │
│  │  ✅ Loading & error states                           │    │
│  └─────────────────────────────────────────────────────┘    │
└───────────────────────────────────────────────────────────────┘
                               ↓
┌─────────────────────────────────────────────────────────────┐
│                      BUSINESS LOGIC LAYER                    │
│                         (Services)                           │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  services/placeService.ts (PlaceService)            │    │
│  │                                                       │    │
│  │  CRUD Operations:                                    │    │
│  │  ├── getAll()           - Get all places            │    │
│  │  ├── getById(id)        - Get single place          │    │
│  │  ├── create(data)       - Create new place          │    │
│  │  ├── update(id, data)   - Update place              │    │
│  │  └── delete(id)         - Delete place              │    │
│  │                                                       │    │
│  │  Filtering & Search:                                 │    │
│  │  ├── getByCategory(category)  - Filter by category  │    │
│  │  ├── getFavorites()           - Get favorites       │    │
│  │  ├── getVisited()             - Get visited         │    │
│  │  └── search(query)            - Search places       │    │
│  │                                                       │    │
│  │  Special Features:                                   │    │
│  │  ├── getRandom(category?)     - Random picker       │    │
│  │  ├── getStatistics()          - Stats & analytics   │    │
│  │  ├── toggleFavorite(id, val)  - Toggle favorite     │    │
│  │  └── toggleVisited(id, val)   - Toggle visited      │    │
│  │                                                       │    │
│  │  Responsibilities:                                   │    │
│  │  ✅ Data validation                                  │    │
│  │  ✅ Business rules enforcement                       │    │
│  │  ✅ Error handling                                   │    │
│  │  ✅ Data transformation                              │    │
│  └─────────────────────────────────────────────────────┘    │
└───────────────────────────────────────────────────────────────┘
                               ↓
┌─────────────────────────────────────────────────────────────┐
│                      DATA ACCESS LAYER                       │
│                    (Supabase Integration)                    │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  integrations/supabase/                              │    │
│  │  ├── client.ts          - Supabase client           │    │
│  │  └── types.ts           - Database types            │    │
│  └─────────────────────────────────────────────────────┘    │
│                              ↓                                │
│  ┌─────────────────────────────────────────────────────┐    │
│  │         Supabase Backend (PostgreSQL)                │    │
│  │                                                       │    │
│  │  Tables:                                             │    │
│  │  └── places                                          │    │
│  │      ├── id (uuid)                                   │    │
│  │      ├── name (text)                                 │    │
│  │      ├── description (text)                          │    │
│  │      ├── address (text)                              │    │
│  │      ├── category (enum)                             │    │
│  │      ├── image (text)                                │    │
│  │      ├── rating (numeric)                            │    │
│  │      ├── is_favorite (boolean)                       │    │
│  │      ├── visited (boolean)                           │    │
│  │      └── ... more fields                             │    │
│  └─────────────────────────────────────────────────────┘    │
└───────────────────────────────────────────────────────────────┘
```

---

## Data Flow Diagram

### Read Flow (Query)
```
User Action (Page Load)
    ↓
Component calls usePlaces() hook
    ↓
React Query checks cache
    ├── Cache Hit → Return cached data
    └── Cache Miss → Continue
        ↓
    Hook calls PlaceService.getAll()
        ↓
    Service calls Supabase API
        ↓
    Supabase returns data
        ↓
    Service transforms/validates data
        ↓
    Hook caches data (React Query)
        ↓
    Component receives data
        ↓
    UI updates
```

### Write Flow (Mutation)
```
User Action (Click Save)
    ↓
Component calls useCreatePlace().mutate()
    ↓
Hook shows optimistic update (optional)
    ↓
Hook calls PlaceService.create(data)
    ↓
Service validates data
    ↓
Service calls Supabase API
    ↓
Supabase inserts data & returns result
    ↓
Service returns result to hook
    ↓
Hook invalidates related caches
    ├── invalidate places list cache
    ├── invalidate statistics cache
    └── refetch affected queries
        ↓
    Hook shows success toast
        ↓
    Component receives success callback
        ↓
    Navigate to new page (optional)
        ↓
    UI updates with fresh data
```

---

## Component Communication Flow

```
┌─────────────────────────────────────────────────────────────┐
│                     Places.tsx (List Page)                   │
│                                                               │
│  const { data: places } = usePlaces({ category: 'cafe' });  │
│  const toggleFavorite = useToggleFavorite();                │
│                                                               │
│  ┌───────────────────────────────────────────────────┐      │
│  │  PlaceCard Component                              │      │
│  │  <PlaceCard                                       │      │
│  │    place={place}                                  │      │
│  │    onToggleFavorite={toggleFavorite}              │      │
│  │  />                                               │      │
│  │                                                    │      │
│  │  ┌─────────────────────────────────────────┐     │      │
│  │  │  Favorite Button                        │     │      │
│  │  │  onClick={() => toggleFavorite.mutate({ │     │      │
│  │  │    id: place.id,                        │     │      │
│  │  │    isFavorite: !place.is_favorite       │     │      │
│  │  │  })}                                     │     │      │
│  │  └─────────────────────────────────────────┘     │      │
│  └───────────────────────────────────────────────────┘      │
└───────────────────────────────────────────────────────────────┘
                        ↓
┌───────────────────────────────────────────────────────────────┐
│              useToggleFavorite() Hook                         │
│                                                                │
│  useMutation({                                                │
│    mutationFn: ({ id, isFavorite }) =>                       │
│      PlaceService.toggleFavorite(id, isFavorite),            │
│    onSuccess: () => {                                         │
│      queryClient.invalidateQueries(['places']);              │
│      toast.success('Updated!');                              │
│    }                                                          │
│  })                                                           │
└───────────────────────────────────────────────────────────────┘
                        ↓
┌───────────────────────────────────────────────────────────────┐
│           PlaceService.toggleFavorite()                       │
│                                                                │
│  static async toggleFavorite(id, isFavorite) {               │
│    const { data, error } = await supabase                    │
│      .from('places')                                          │
│      .update({ is_favorite: isFavorite })                    │
│      .eq('id', id)                                            │
│      .select()                                                │
│      .single();                                               │
│    return data;                                               │
│  }                                                            │
└───────────────────────────────────────────────────────────────┘
                        ↓
┌───────────────────────────────────────────────────────────────┐
│                    Supabase Backend                           │
│  UPDATE places SET is_favorite = true WHERE id = '...'       │
└───────────────────────────────────────────────────────────────┘
```

---

## State Management with React Query

### Cache Structure
```
QueryClient Cache
├── ['places', { category: 'cafe' }]
│   ├── data: Place[]
│   ├── status: 'success'
│   ├── staleTime: 5 minutes
│   └── lastUpdated: timestamp
│
├── ['places', { search: 'lawang' }]
│   └── data: Place[]
│
├── ['places', 'detail', 'uuid-123']
│   └── data: Place
│
├── ['places', 'random', 'cafe']
│   └── data: Place
│
└── ['places', 'statistics']
    └── data: { total: 50, favorites: 10, ... }
```

### Cache Invalidation Strategy
```
CREATE Place
  ↓
  invalidate: ['places'] (all list queries)
  invalidate: ['places', 'statistics']
  
UPDATE Place
  ↓
  invalidate: ['places', 'detail', id]
  invalidate: ['places'] (all list queries)
  invalidate: ['places', 'statistics']
  
DELETE Place
  ↓
  invalidate: ['places'] (all list queries)
  invalidate: ['places', 'statistics']
  
TOGGLE Favorite
  ↓
  invalidate: ['places', 'detail', id]
  invalidate: ['places'] (all list queries)
```

---

## Error Flow

```
Service Layer Error
    ↓
PlaceService.create() throws Error
    ↓
Hook catches error
    ↓
useCreatePlace() onError callback
    ↓
Toast notification shown
    ↓
Component onError callback (optional)
    ↓
Error state available in component
    ↓
UI shows error message
```

---

## File Organization

```
src/
├── pages/                    # Route components
│   ├── Places.tsx           # Uses: usePlaces, useToggleFavorite
│   ├── CreatePlace.tsx      # Uses: useCreatePlace
│   ├── EditPlace.tsx        # Uses: usePlace, useUpdatePlace
│   ├── PlaceDetail.tsx      # Uses: usePlace, useDeletePlace, useToggleFavorite
│   └── Randomizer.tsx       # Uses: useRandomPlace
│
├── components/              # Reusable UI components
│   ├── PlaceCard.tsx        # Props: place, callbacks
│   └── Layout.tsx           # App shell
│
├── hooks/                   # Custom React Query hooks
│   └── usePlaces.ts         # All place-related hooks
│
├── services/                # Business logic
│   └── placeService.ts      # PlaceService class
│
├── integrations/            # External services
│   └── supabase/
│       ├── client.ts        # Supabase client instance
│       └── types.ts         # Auto-generated DB types
│
├── types/                   # TypeScript types
│   └── place.ts             # Place domain types
│
└── lib/                     # Utilities
    └── utils.ts
```

---

## Key Benefits of This Architecture

### 1. Separation of Concerns
- ✅ **UI Components**: Only handle rendering & user interactions
- ✅ **Hooks**: Only handle state management & data fetching
- ✅ **Services**: Only handle business logic & API calls

### 2. Single Responsibility
- ✅ Each layer has ONE clear responsibility
- ✅ Easy to understand where code belongs
- ✅ Changes isolated to specific layers

### 3. Testability
```typescript
// Test Service (no UI dependencies)
describe('PlaceService', () => {
  it('should create place', async () => {
    const place = await PlaceService.create({...});
    expect(place).toHaveProperty('id');
  });
});

// Test Hook (no UI dependencies)
describe('usePlaces', () => {
  it('should fetch places', () => {
    const { result } = renderHook(() => usePlaces());
    expect(result.current.data).toBeDefined();
  });
});

// Test Component (mock hooks)
describe('Places', () => {
  it('should render places', () => {
    // Mock usePlaces hook
    render(<Places />);
    expect(screen.getByText('Tempat di Semarang')).toBeInTheDocument();
  });
});
```

### 4. Reusability
```tsx
// Hook can be used in multiple components
function PlacesList() {
  const { data } = usePlaces();
  // ...
}

function PlacesMap() {
  const { data } = usePlaces();
  // Same hook, different UI
}

function PlaceCounter() {
  const { data } = usePlaces();
  return <div>Total: {data?.length}</div>;
}
```

### 5. Performance
- ✅ React Query handles caching automatically
- ✅ No duplicate API calls
- ✅ Background refetching for fresh data
- ✅ Optimistic updates for instant UI feedback

---

## Migration Path (Old → New)

### Before (Monolithic Component)
```tsx
function Places() {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    fetchPlaces();
  }, []);
  
  const fetchPlaces = async () => {
    setLoading(true);
    const { data } = await supabase.from('places').select();
    setPlaces(data);
    setLoading(false);
  };
  
  const handleToggleFavorite = async (id) => {
    await supabase.from('places').update({...}).eq('id', id);
    fetchPlaces(); // Refetch all
  };
  
  // 100+ lines of UI code mixed with logic
}
```

### After (Clean Architecture)
```tsx
// Component (UI Only)
function Places() {
  const { data: places, isLoading } = usePlaces();
  const toggleFavorite = useToggleFavorite();
  
  if (isLoading) return <Spinner />;
  
  return <PlacesList places={places} onToggle={toggleFavorite.mutate} />;
}

// Hook (State Management)
function usePlaces() {
  return useQuery({
    queryKey: ['places'],
    queryFn: () => PlaceService.getAll(),
  });
}

// Service (Business Logic)
class PlaceService {
  static async getAll() {
    const { data } = await supabase.from('places').select();
    return data;
  }
}
```

---

## Next Steps for Complete Migration

1. ✅ Services layer - **DONE**
2. ✅ React Query hooks - **DONE**
3. ✅ Major pages (Places, Create, Edit) - **DONE**
4. ⏳ Remaining pages (PlaceDetail, Randomizer, Home, Profile)
5. ⏳ Add more features (toggle visited, advanced filters)
6. ⏳ Add unit tests
7. ⏳ Add E2E tests

---

## Resources

- [React Query Docs](https://tanstack.com/query/latest)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Supabase Docs](https://supabase.com/docs)
