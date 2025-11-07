# FakeStore Dashboard (SvelteKit + Tailwind 4)

## Features
- Product List + Search + Filter + Pagination
- Product Detail + Breadcrumb
- Category Page
- Responsive Layout
- Caching Store (Svelte writable)
- Dark Mode Toggle

## Tech Stack
- SvelteKit
- TailwindCSS v4
- TypeScript

## Run
```sh
pnpm install / npm install
pnpm run dev / npm run dev
```

# FakeStore Dashboard (SvelteKit + Tailwind 4)

A modern, scalable e-commerce dashboard built with SvelteKit and TailwindCSS v4, featuring product listing, search, filtering, and dark mode with comprehensive unit testing.

## ✨ Features

- 📦 **Product Management**: Product list with search, filter, and pagination
- 🔍 **Product Detail**: Detailed product view with breadcrumb navigation
- 📂 **Category Pages**: Browse products by category
- 📱 **Responsive Layout**: Mobile-first responsive design
- 🌓 **Dark Mode**: Persistent dark mode toggle with localStorage
- 💾 **Caching**: Client-side caching using Svelte stores
- ⚡ **Lazy Loading**: Image lazy loading with IntersectionObserver
- 🧪 **Unit Testing**: Comprehensive tests with Vitest
- 🎯 **Type Safety**: Full TypeScript support with proper typing
- 🏗️ **Scalable Architecture**: Clean code structure with composables and utilities

## 🛠️ Tech Stack

- **Framework**: SvelteKit 2.x (Svelte 5)
- **Styling**: TailwindCSS v4
- **Language**: TypeScript
- **Testing**: Vitest + @testing-library/svelte
- **API**: FakeStore API

## 🚀 Getting Started

### Installation

```bash
# Install dependencies
pnpm install
# or
npm install
```

### Development

```bash
# Start dev server
pnpm dev
# or
npm run dev
```

Visit `http://localhost:5173`

### Build

```bash
# Build for production
pnpm build
# or
npm run build
```

### Preview Production Build

```bash
pnpm preview
# or
npm run preview
```

## 🧪 Testing

```bash
# Run tests
pnpm test

# Run tests in UI mode
pnpm test:ui

# Run tests with coverage
pnpm test:coverage
```

## 📁 Project Structure

```
src/
├── lib/
│   ├── components/          # Reusable Svelte components
│   │   ├── Pagination.svelte
│   │   └── ProductCard.svelte
│   ├── composables/         # Reusable logic (hooks)
│   │   ├── useIntersectionObserver.ts
│   │   └── useProducts.ts
│   ├── store/               # Svelte stores (state management)
│   │   └── products.ts      # Products & dark mode store
│   ├── types/               # TypeScript type definitions
│   │   └── index.ts
│   ├── utils/               # Utility functions
│   │   ├── api.ts           # API client
│   │   ├── debounce.ts      # Debounce utility
│   │   └── filters.ts       # Product filter utilities
│   └── assets/              # Static assets
├── routes/                  # SvelteKit routes
│   ├── +layout.svelte       # Root layout
│   ├── +page.svelte         # Home (product list)
│   ├── product/
│   │   └── [id]/            # Product detail page
│   └── category/
│       └── [name]/          # Category page
├── tests/                   # Test setup
│   └── setup.ts
└── app.css                  # Global styles

```

## 🏗️ Architecture & Design Patterns

### Composables (Custom Hooks)

Located in `src/lib/composables/`, these provide reusable logic:

- `useIntersectionObserver`: Lazy loading images with IntersectionObserver
- `useProducts`: Product data fetching and state management

### Store Management

All global state is managed through Svelte stores:

- `productsStore`: Cached product data
- `categoriesStore`: Available categories
- `darkModeStore`: Dark mode state with localStorage persistence

### Type Safety

Full TypeScript support with interfaces in `src/lib/types/`:

- `Product`: Product data structure
- `PaginatedResponse`: API pagination response
- `Category`: Category type

### Utilities

Clean, testable utility functions:

- `api.ts`: API client with error handling
- `debounce.ts`: Generic debounce function
- `filters.ts`: Product filtering and sorting

## 🎨 Dark Mode

Dark mode is implemented with:
- Toggle button in the header
- Persistent state using localStorage
- Smooth transitions
- Applies to all pages and components

## 🧪 Testing Strategy

### Unit Tests

- ✅ API client (`api.test.ts`)
- ✅ Debounce utility (`debounce.test.ts`)
- ✅ Filter utilities (`filters.test.ts`)

### Test Coverage

Run `pnpm test:coverage` to see detailed coverage report.

## 📝 Code Quality

- **Clean Code**: Following SOLID principles
- **Separation of Concerns**: Clear separation between UI, logic, and data
- **DRY Principle**: Reusable composables and utilities
- **Type Safety**: Comprehensive TypeScript typing
- **Error Handling**: Proper error handling in API calls

## 🔄 API Integration

Using [FakeStore API](https://fakestoreapi.com) for demo data:

- `GET /products` - All products
- `GET /products/:id` - Single product
- `GET /products/categories` - All categories
- `GET /products/category/:name` - Products by category

## 🚀 Performance Optimizations

- Lazy loading images with IntersectionObserver
- Client-side caching with Svelte stores
- Debounced search input
- Pagination for better data handling

## 📄 License

MIT

## 🤝 Contributing

Contributions, issues and feature requests are welcome!

---

Built with ❤️ using SvelteKit and TailwindCSS

