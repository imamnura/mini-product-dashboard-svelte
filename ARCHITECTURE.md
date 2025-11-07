# Architecture Documentation

## Overview

This application follows a **layered architecture** with clear separation of concerns, making it maintainable, testable, and scalable.

## Layers

### 1. Presentation Layer (Components)

Located in `src/lib/components/` and `src/routes/`

**Responsibilities:**
- Render UI
- Handle user interactions
- Display data from stores/composables

**Best Practices:**
- Keep components small and focused
- Use props for configuration
- Emit events for parent communication
- Avoid business logic in components

### 2. Business Logic Layer (Composables)

Located in `src/lib/composables/`

**Responsibilities:**
- Reusable business logic
- State management
- Side effects coordination

**Example:**
```typescript
// useProducts.ts
export function useProducts(itemsPerPage: number = 6) {
  const products = writable<Product[]>([]);
  const loading = writable<boolean>(true);
  
  async function loadProducts(page: number = 1) {
    loading.set(true);
    // ... fetch logic
  }
  
  return { products, loading, loadProducts };
}
```

### 3. Data Layer (API & Stores)

**API Client** (`src/lib/utils/api.ts`):
- Centralized API communication
- Error handling
- Type-safe responses

**Stores** (`src/lib/store/`):
- Global state management
- Persistence (localStorage)
- Reactive data

### 4. Utility Layer

Located in `src/lib/utils/`

**Pure Functions:**
- No side effects
- Easily testable
- Reusable across the app

Examples:
- `debounce`: Generic debounce function
- `filters`: Product filtering and sorting

## Design Patterns

### 1. **Composable Pattern** (Hooks)

Reusable logic encapsulated in functions:

```typescript
function useIntersectionObserver(callback, options) {
  // Setup observer
  // Return cleanup and observe functions
}
```

### 2. **Store Pattern**

Centralized state management:

```typescript
export const productsStore = writable<Product[]>([]);
```

### 3. **API Client Pattern**

Single source of truth for API calls:

```typescript
class ApiClient {
  private async fetchWithErrorHandling<T>(url: string): Promise<T> {
    // Centralized error handling
  }
}
```

### 4. **Factory Pattern**

Creating specialized stores:

```typescript
function createDarkModeStore() {
  // Create store with custom methods
  return { subscribe, toggle, init, set };
}
```

## Data Flow

```
User Interaction (Component)
    ↓
Composable/Store (Business Logic)
    ↓
API Client (Data Fetching)
    ↓
Store Update (State Management)
    ↓
Component Re-render (Reactive Updates)
```

## File Organization

### By Feature

Each feature is self-contained:

```
lib/
├── components/       # UI components
├── composables/      # Business logic
├── store/            # State management
├── utils/            # Utilities
└── types/            # Type definitions
```

## Type Safety

### Interfaces First

Define types before implementation:

```typescript
// types/index.ts
export interface Product {
  id: number;
  title: string;
  // ...
}
```

### Generic Types

Reusable type patterns:

```typescript
export interface PaginatedResponse<T> {
  data: T[];
  totalPages: number;
}
```

## Testing Strategy

### 1. Unit Tests

Test individual functions:
- Utilities (debounce, filters)
- API client methods

### 2. Integration Tests

Test feature workflows:
- Data fetching + state updates
- User interactions + UI updates

### 3. Test Structure

```
describe('Feature', () => {
  beforeEach(() => {
    // Setup
  });

  it('should do something', () => {
    // Arrange
    // Act
    // Assert
  });
});
```

## Performance Considerations

### 1. Lazy Loading

Images loaded only when visible:

```typescript
useIntersectionObserver((isIntersecting) => {
  if (isIntersecting) loadImage();
});
```

### 2. Debouncing

Reduce unnecessary API calls:

```typescript
const debouncedSearch = debounce(search, 300);
```

### 3. Caching

Store fetched data:

```typescript
const cached = get(productsStore);
if (cached.length) {
  products = cached;
}
```

## Error Handling

### API Level

```typescript
private async fetchWithErrorHandling<T>(url: string): Promise<T> {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}
```

### Component Level

```typescript
const error = writable<string | null>(null);

try {
  await loadData();
} catch (err) {
  error.set(err.message);
}
```

## State Management

### Local State

Use `$state` for component-local state:

```typescript
let isVisible = $state(false);
```

### Global State

Use stores for shared state:

```typescript
export const productsStore = writable<Product[]>([]);
```

### Derived State

Use reactive statements:

```typescript
$: filtered = products.filter(/* ... */);
```

## Scalability Guidelines

### Adding New Features

1. **Define Types** in `src/lib/types/`
2. **Create API Methods** in `src/lib/utils/api.ts`
3. **Add Store** if needed in `src/lib/store/`
4. **Create Composable** for business logic
5. **Build Component** in `src/lib/components/`
6. **Write Tests** for all layers

### Code Quality Checklist

- ✅ TypeScript types defined
- ✅ Error handling implemented
- ✅ Unit tests written
- ✅ Components are small (<200 lines)
- ✅ No business logic in components
- ✅ Reusable logic in composables
- ✅ Pure functions in utilities

## Future Improvements

1. **State Management**: Consider Zustand or Pinia for complex state
2. **API Layer**: Add request caching and retry logic
3. **Testing**: Add E2E tests with Playwright
4. **Performance**: Implement virtual scrolling for large lists
5. **Accessibility**: Add ARIA labels and keyboard navigation
6. **PWA**: Add service worker for offline support

---

This architecture ensures the application remains maintainable, testable, and scalable as it grows.
