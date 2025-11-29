# 🚀 Quick Start Guide - Using Services & Hooks

## Table of Contents
1. [Installation](#installation)
2. [Basic Usage](#basic-usage)
3. [Available Hooks](#available-hooks)
4. [Common Patterns](#common-patterns)
5. [Error Handling](#error-handling)
6. [Best Practices](#best-practices)

---

## Installation

Dependencies sudah terinstall:
- `@tanstack/react-query` - State management & data fetching
- `@tanstack/react-query-devtools` - Debugging tools

---

## Basic Usage

### 1. Setup (Already Done in `main.tsx`)
```tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient();

<QueryClientProvider client={queryClient}>
  <App />
  <ReactQueryDevtools />
</QueryClientProvider>
```

---

## Available Hooks

### 📖 Query Hooks (Fetching Data)

#### `usePlaces(filters?)`
Fetch list of places dengan optional filters.

```tsx
import { usePlaces } from '@/hooks/usePlaces';

function PlacesList() {
  const { data: places, isLoading, error } = usePlaces();
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <div>
      {places?.map(place => (
        <div key={place.id}>{place.name}</div>
      ))}
    </div>
  );
}
```

**With Filters**:
```tsx
// Filter by category
const { data: cafes } = usePlaces({ category: 'cafe' });

// Filter by search
const { data: results } = usePlaces({ search: 'lawang' });

// Filter favorites only
const { data: favorites } = usePlaces({ isFavorite: true });

// Combine filters
const { data: filteredPlaces } = usePlaces({ 
  category: 'restaurant',
  search: 'semarang'
});
```

---

#### `usePlace(id)`
Fetch single place by ID.

```tsx
import { usePlace } from '@/hooks/usePlaces';
import { useParams } from 'react-router-dom';

function PlaceDetail() {
  const { id } = useParams();
  const { data: place, isLoading, error } = usePlace(id);
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Not found</div>;
  
  return (
    <div>
      <h1>{place?.name}</h1>
      <p>{place?.description}</p>
    </div>
  );
}
```

---

#### `useRandomPlace(category?)`
Get random place, useful for randomizer feature.

```tsx
import { useRandomPlace } from '@/hooks/usePlaces';

function Randomizer() {
  const [category, setCategory] = useState('all');
  const { data: randomPlace, refetch, isFetching } = useRandomPlace(category);
  
  const handleRandomize = () => {
    refetch(); // Trigger fetch manually
  };
  
  return (
    <div>
      <button onClick={handleRandomize} disabled={isFetching}>
        {isFetching ? 'Rolling...' : '🎲 Randomize'}
      </button>
      
      {randomPlace && (
        <PlaceCard place={randomPlace} />
      )}
    </div>
  );
}
```

---

#### `usePlaceStatistics()`
Get statistics about places.

```tsx
import { usePlaceStatistics } from '@/hooks/usePlaces';

function Dashboard() {
  const { data: stats } = usePlaceStatistics();
  
  return (
    <div>
      <div>Total Places: {stats?.total}</div>
      <div>Favorites: {stats?.favoriteCount}</div>
      <div>Visited: {stats?.visitedCount}</div>
      <div>By Category: {JSON.stringify(stats?.byCategory)}</div>
    </div>
  );
}
```

---

### ✏️ Mutation Hooks (Modifying Data)

#### `useCreatePlace()`
Create new place.

```tsx
import { useCreatePlace } from '@/hooks/usePlaces';
import { useNavigate } from 'react-router-dom';

function CreatePlaceForm() {
  const navigate = useNavigate();
  const createMutation = useCreatePlace();
  const [formData, setFormData] = useState({...});
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    createMutation.mutate(
      {
        name: formData.name,
        description: formData.description,
        address: formData.address,
        category: formData.category,
        image: formData.image,
        rating: formData.rating,
        // ... other fields
      },
      {
        onSuccess: () => {
          // Toast automatically shown
          navigate('/places');
        },
        onError: (error) => {
          // Toast automatically shown
          console.error(error);
        }
      }
    );
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button 
        type="submit" 
        disabled={createMutation.isPending}
      >
        {createMutation.isPending ? 'Creating...' : 'Create Place'}
      </button>
    </form>
  );
}
```

---

#### `useUpdatePlace()`
Update existing place.

```tsx
import { useUpdatePlace } from '@/hooks/usePlaces';

function EditPlaceForm({ placeId, initialData }) {
  const updateMutation = useUpdatePlace();
  const [formData, setFormData] = useState(initialData);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    updateMutation.mutate(
      { 
        id: placeId, 
        data: {
          name: formData.name,
          description: formData.description,
          // ... other fields
        }
      },
      {
        onSuccess: () => {
          // Cache automatically invalidated
          // Toast automatically shown
        }
      }
    );
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button disabled={updateMutation.isPending}>
        Update
      </button>
    </form>
  );
}
```

---

#### `useDeletePlace()`
Delete a place.

```tsx
import { useDeletePlace } from '@/hooks/usePlaces';

function DeleteButton({ placeId }) {
  const deleteMutation = useDeletePlace();
  
  const handleDelete = () => {
    if (confirm('Are you sure?')) {
      deleteMutation.mutate(placeId, {
        onSuccess: () => {
          // Navigate or do something
        }
      });
    }
  };
  
  return (
    <button 
      onClick={handleDelete}
      disabled={deleteMutation.isPending}
    >
      {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
    </button>
  );
}
```

---

#### `useToggleFavorite()`
Toggle favorite status.

```tsx
import { useToggleFavorite } from '@/hooks/usePlaces';

function FavoriteButton({ place }) {
  const toggleFavorite = useToggleFavorite();
  
  const handleToggle = () => {
    toggleFavorite.mutate({
      id: place.id,
      isFavorite: !place.is_favorite
    });
  };
  
  return (
    <button 
      onClick={handleToggle}
      disabled={toggleFavorite.isPending}
    >
      {place.is_favorite ? '❤️' : '🤍'}
    </button>
  );
}
```

---

## Common Patterns

### Pattern 1: Loading & Error States
```tsx
function MyComponent() {
  const { data, isLoading, error, isError } = usePlaces();
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  if (isError) {
    return <ErrorMessage message={error.message} />;
  }
  
  return <PlacesList places={data} />;
}
```

---

### Pattern 2: Optimistic Updates
```tsx
function PlaceCard({ place }) {
  const toggleFavorite = useToggleFavorite();
  
  const handleToggle = () => {
    // UI updates immediately, then syncs with server
    toggleFavorite.mutate({
      id: place.id,
      isFavorite: !place.is_favorite
    });
  };
  
  // UI reflects the change immediately
  return (
    <button onClick={handleToggle}>
      {place.is_favorite ? '❤️' : '🤍'}
    </button>
  );
}
```

---

### Pattern 3: Manual Refetch
```tsx
function PlacesList() {
  const { data, refetch, isFetching } = usePlaces();
  
  return (
    <div>
      <button 
        onClick={() => refetch()}
        disabled={isFetching}
      >
        {isFetching ? 'Refreshing...' : 'Refresh'}
      </button>
      
      {data?.map(place => <PlaceCard key={place.id} place={place} />)}
    </div>
  );
}
```

---

### Pattern 4: Dependent Queries
```tsx
function PlaceDetailWithStats({ placeId }) {
  // First query
  const { data: place, isLoading: placeLoading } = usePlace(placeId);
  
  // Second query (only runs after first succeeds)
  const { data: stats } = usePlaceStatistics();
  
  if (placeLoading) return <div>Loading...</div>;
  
  return (
    <div>
      <h1>{place?.name}</h1>
      <p>Total places: {stats?.total}</p>
    </div>
  );
}
```

---

### Pattern 5: Search with Debounce
```tsx
import { useState, useEffect } from 'react';
import { usePlaces } from '@/hooks/usePlaces';

function SearchPlaces() {
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  
  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchInput]);
  
  const { data: places, isLoading } = usePlaces({ 
    search: debouncedSearch 
  });
  
  return (
    <div>
      <input 
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        placeholder="Search places..."
      />
      
      {isLoading && <div>Searching...</div>}
      
      <div>
        {places?.map(place => <PlaceCard key={place.id} place={place} />)}
      </div>
    </div>
  );
}
```

---

## Error Handling

### Global Error Handling (Already setup in hooks)
```tsx
// In hooks/usePlaces.ts
export function useCreatePlace() {
  return useMutation({
    mutationFn: (data) => PlaceService.create(data),
    onError: (error: Error) => {
      // Toast notification automatically shown
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}
```

### Component-level Error Handling
```tsx
function MyComponent() {
  const createMutation = useCreatePlace();
  
  const handleSubmit = (data) => {
    createMutation.mutate(data, {
      // Override global error handler if needed
      onError: (error) => {
        console.error('Custom error handling:', error);
        // Show custom error UI
      }
    });
  };
}
```

---

## Best Practices

### ✅ DO:
1. **Use hooks in components** (not in services)
   ```tsx
   // ✅ Good
   function MyComponent() {
     const { data } = usePlaces();
   }
   ```

2. **Use service methods for business logic**
   ```tsx
   // ✅ Good - In PlaceService
   static async create(data: PlaceInsert) {
     // Validation
     if (!data.name) throw new Error('Name required');
     // Business logic
     return await supabase.from('places').insert(data);
   }
   ```

3. **Handle loading states**
   ```tsx
   // ✅ Good
   if (isLoading) return <Spinner />;
   ```

4. **Provide callbacks for mutations**
   ```tsx
   // ✅ Good
   mutation.mutate(data, {
     onSuccess: () => navigate('/success'),
     onError: (err) => console.error(err)
   });
   ```

### ❌ DON'T:
1. **Don't call Supabase directly in components**
   ```tsx
   // ❌ Bad
   const places = await supabase.from('places').select();
   
   // ✅ Good
   const { data: places } = usePlaces();
   ```

2. **Don't manage cache manually**
   ```tsx
   // ❌ Bad - React Query does this automatically
   setPlaces([...places, newPlace]);
   
   // ✅ Good - Let React Query handle it
   createMutation.mutate(newPlace);
   ```

3. **Don't forget error handling**
   ```tsx
   // ❌ Bad
   const { data } = usePlaces();
   return <div>{data.map(...)}</div>; // Crashes if error
   
   // ✅ Good
   const { data, error } = usePlaces();
   if (error) return <Error />;
   return <div>{data?.map(...)}</div>;
   ```

---

## React Query DevTools

DevTools sudah aktif di development mode:
- Press `Ctrl/Cmd + Shift + D` untuk toggle
- Lihat semua queries yang sedang berjalan
- Inspect cache
- Manually refetch queries
- Clear cache

---

## TypeScript Support

Semua hooks sudah fully typed:
```tsx
import type { Database } from '@/integrations/supabase/types';

type Place = Database['public']['Tables']['places']['Row'];
type PlaceInsert = Database['public']['Tables']['places']['Insert'];
type PlaceUpdate = Database['public']['Tables']['places']['Update'];

// Types auto-inferred
const { data: places } = usePlaces(); // places: Place[]
const { data: place } = usePlace(id);  // place: Place | null
```

---

## Next Steps

Untuk pages yang belum direfactor, ikuti pattern yang sama:

1. Import hook yang diperlukan
2. Replace manual fetch dengan query hook
3. Replace manual mutations dengan mutation hooks
4. Remove manual state management
5. Let React Query handle caching & refetching

**Example**: Refactor `PlaceDetail.tsx`
```tsx
// Before
const [place, setPlace] = useState(null);
useEffect(() => { fetchPlace(); }, [id]);

// After
const { data: place, isLoading } = usePlace(id);
```

---

Selamat coding! 🚀
