# CIARA User Register - Astro Frontend

A modern, responsive frontend application built with Astro for user authentication and record management.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm (or yarn/pnpm)

### Installation

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:4321`

### Build

Build for production:

```bash
npm run build
```

### Preview

Preview the production build:

```bash
npm run preview
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable Astro components
│   │   ├── AuthSection.astro    # Login and registration UI
│   │   └── AppSection.astro     # Record management UI
│   ├── layouts/              # Page layouts
│   │   └── Layout.astro      # Main layout wrapper
│   ├── lib/                  # JavaScript modules
│   │   ├── authService.ts    # Authentication logic
│   │   ├── recordsService.ts # Records CRUD operations
│   │   └── appState.ts       # Application state management
│   ├── pages/                # Astro pages (routes)
│   │   └── index.astro       # Home page
│   └── styles/               # Global styles
│       └── global.css        # Main stylesheet
├── public/                   # Static assets
├── astro.config.mjs          # Astro configuration
├── package.json              # Dependencies
└── tsconfig.json             # TypeScript configuration
```

## 🔄 Migration from Original Code

### Component Mapping

| Original File | Astro Component | Purpose |
|--------------|----------------|---------|
| `index.html` (auth section) | `AuthSection.astro` | Login form and seed registration |
| `index.html` (app section) | `AppSection.astro` | Record creation and listing |
| `index.html` (structure) | `Layout.astro` | Page layout and HTML structure |
| `app.js` (auth functions) | `lib/authService.ts` | Authentication service module |
| `app.js` (record functions) | `lib/recordsService.ts` | Records service module |
| `app.js` (UI state) | `lib/appState.ts` | Application state management |
| `styles.css` | `styles/global.css` | Enhanced global styles |

### Key Improvements

#### 1. **Structure & Organization**
- **Before**: Single HTML file with inline scripts
- **After**: Modular Astro components with separated concerns
- **Why**: Better maintainability, reusability, and code organization

#### 2. **JavaScript Architecture**
- **Before**: Global functions and variables, single file
- **After**: Modular TypeScript services with clear interfaces
- **Why**: Type safety, better error handling, easier testing

#### 3. **HTML Semantics**
- **Before**: Basic divs and minimal semantic HTML
- **After**: Proper semantic tags (`<main>`, `<section>`, `<header>`, proper labels)
- **Why**: Better SEO, accessibility, and screen reader support

#### 4. **Accessibility**
- **Before**: Basic form labels
- **After**: 
  - Proper `aria-label` and `aria-required` attributes
  - `role="status"` and `aria-live` for dynamic messages
  - Proper heading hierarchy
  - Focus management
- **Why**: WCAG compliance and better user experience for all users

#### 5. **Responsive Design**
- **Before**: Basic grid layout, not fully responsive
- **After**: 
  - Mobile-first approach
  - Responsive grid that stacks on mobile
  - Fluid typography with `clamp()`
  - Proper spacing at all breakpoints
- **Why**: Works seamlessly on all device sizes

#### 6. **CSS Improvements**
- **Before**: Minimal styles, no CSS variables, limited theming
- **After**: 
  - CSS custom properties for theming
  - Dark mode support via `prefers-color-scheme`
  - High contrast mode support
  - Reduced motion support
  - Better visual hierarchy and spacing
- **Why**: Modern, maintainable styling with better UX

#### 7. **Error Handling**
- **Before**: Basic error messages
- **After**: Structured error handling with try-catch blocks and user-friendly messages
- **Why**: Better user experience and debugging

#### 8. **Performance**
- **Before**: All code loaded upfront
- **After**: Astro's component-based architecture with `client:load` directives for interactivity
- **Why**: Better initial load times and optimized JavaScript delivery

## 🔧 Configuration

### API Base URL

The API base URL can be configured via environment variables. Create a `.env` file:

```env
PUBLIC_API_BASE=http://localhost:4000/api
```

If not set, it defaults to `http://localhost:4000/api`.

## 📝 Features

- ✅ User authentication (login)
- ✅ Demo user registration
- ✅ JWT token management
- ✅ Create records
- ✅ List records
- ✅ Logout functionality
- ✅ Responsive design
- ✅ Dark mode support
- ✅ Accessibility features
- ✅ Error handling

## 🎨 Styling

The application uses a modern CSS approach with:
- CSS Custom Properties for theming
- Mobile-first responsive design
- Dark mode support
- High contrast mode support
- Reduced motion support for accessibility

## ♿ Accessibility

The application follows WCAG 2.1 guidelines:
- Semantic HTML structure
- Proper ARIA labels and roles
- Keyboard navigation support
- Screen reader friendly
- Focus management
- High contrast support

## 🛠️ Development Notes

- Components use `client:load` directive to ensure JavaScript runs in the browser
- Services are written in TypeScript for type safety
- All API calls include proper error handling
- Token management uses localStorage (consider security implications for production)

## 📄 License

See the main project LICENSE file.

