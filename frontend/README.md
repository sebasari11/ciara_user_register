# CIARA User Register - Astro Frontend

A modern, responsive frontend application built with Astro for user authentication and user registration management.

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
│   │   ├── AuthSection.astro    # Login and registration UI with tabs
│   │   └── AppSection.astro     # Legacy component (deprecated)
│   ├── layouts/              # Page layouts
│   │   └── Layout.astro      # Main layout wrapper
│   ├── lib/                  # JavaScript modules
│   │   ├── authService.ts    # Authentication logic (login, register)
│   │   ├── recordsService.ts # User registers CRUD operations
│   │   └── appState.ts       # Application state management
│   ├── pages/                # Astro pages (routes)
│   │   ├── index.astro       # Home/login page
│   │   └── users/            # User management pages
│   │       ├── index.astro   # User list page with HTML table, search, pagination
│   │       └── create.astro  # User creation form
│   └── styles/               # Global styles
│       └── global.css        # Main stylesheet
├── public/                   # Static assets
├── astro.config.mjs          # Astro configuration
├── package.json              # Dependencies
└── tsconfig.json             # TypeScript configuration
```

## 🎯 Features

### Authentication
- ✅ User login
- ✅ User registration with form validation
- ✅ Tab-based UI for switching between login and registration
- ✅ JWT token management
- ✅ Automatic redirect to user management after login/registration

### User Registration Form
- ✅ Clean, accessible registration form
- ✅ Real-time form validation:
  - Name validation (2-100 characters)
  - Email format validation
  - Password strength (minimum 6 characters)
  - Password confirmation matching
- ✅ Visual feedback for form errors
- ✅ Field-level error messages
- ✅ Success/error notifications

### User Management
- ✅ **List Users Page** (`/users`)
  - Modern, responsive HTML table (vanilla JavaScript)
  - Real-time search (by email, cédula, university, career)
  - Column sorting (ascending/descending) for multiple fields
  - Server-side pagination with customizable page size (default: 10)
  - User-friendly pagination controls (previous/next, page info)
  - Empty state handling
  - Loading states
  - Responsive design (mobile-friendly card layout)

- ✅ **Create User Page** (`/users/create`)
  - Clean, accessible form with validation
  - Real-time email validation (checks if email exists)
  - Visual feedback for form errors
  - Field-level error messages
  - Success/error notifications
  - Automatic redirect after successful creation

### Technical Features
- ✅ Responsive design (mobile-first)
- ✅ Dark mode support
- ✅ Accessibility features (WCAG 2.1 compliant)
- ✅ Error handling
- ✅ TypeScript for type safety
- ✅ Modern CSS with custom properties
- ✅ No external dependencies (vanilla JavaScript for table)
- ✅ Server-side pagination for performance

## 🔄 Recent Improvements (v3.0)

### Major Changes

#### 1. **Removed Tabulator Dependency**
- **Before**: Used Tabulator library for table rendering
- **After**: Custom HTML table implementation with vanilla JavaScript
- **Why**: 
  - Reduced bundle size
  - No external dependencies
  - Full control over table behavior
  - Better performance

#### 2. **User Registration Form**
- **New Feature**: Complete registration form with tabs
- **Features**:
  - Tab-based UI to switch between login and registration
  - Form validation (name, email, password, password confirmation)
  - Real-time validation feedback
  - Visual error indicators
- **Why**:
  - Better user experience
  - Allows new users to create accounts
  - Professional registration flow

#### 3. **Enhanced Authentication**
- **New Method**: `register(name, email, password)` in authService
- **Removed**: Demo user seed button (users must register properly)
- **Why**:
  - Proper user registration flow
  - Better security practices
  - Real user accounts

#### 4. **Improved Table Implementation**
- **Implementation**: Pure HTML table with vanilla JavaScript
- **Features**:
  - Server-side pagination
  - Column sorting
  - Real-time search
  - Responsive mobile layout
- **Why**:
  - No external dependencies
  - Better performance
  - Full customization control

### Previous Improvements (v2.0)

#### 1. **Separated Views - Two-Page Architecture**

**Before**: Single page with two sections (auth and app) shown/hidden based on state.

**After**: 
- **Page 1 (`/users`)**: Dedicated user list page with advanced features
- **Page 2 (`/users/create`)**: Dedicated user creation form

**Why**: 
- Better user experience with focused, single-purpose pages
- Improved navigation and URL structure
- Easier to maintain and extend
- Better SEO and bookmarking support

#### 2. **Advanced User List Features**

**New Features**:
- **Pagination**: Server-side pagination with configurable page size (default: 10)
- **Search**: Real-time search across multiple fields (email, cédula, university, career)
- **Sorting**: Click column headers to sort by any field (ascending/descending)
- **Modern Table**: Responsive table design with hover effects
- **Empty States**: Clear messaging when no users found

**Why**:
- Better performance with pagination (only loads needed data)
- Improved usability for large datasets
- Professional data management interface
- Scalable solution for growing user base

#### 3. **Enhanced Email Validation**

**New Features**:
- **Backend Validation**: Server-side check for duplicate emails
- **Frontend Validation**: Real-time email existence check (debounced)
- **Visual Feedback**: 
  - "Verificando..." while checking
  - "✓ Email disponible" when available
  - Error message when email exists
- **Prevents Duplicates**: Blocks form submission if email is already registered

**Why**:
- Prevents data integrity issues
- Better user experience (immediate feedback)
- Reduces server errors
- Clear, actionable error messages

#### 4. **Improved Form Validation**

**New Features**:
- Field-level validation with visual indicators
- Real-time error clearing as user types
- Comprehensive validation rules:
  - Required fields
  - Email format validation
  - Age range (1-120)
  - Cédula numeric validation
- Accessible error messages with ARIA attributes

**Why**:
- Better user experience (catch errors early)
- Reduced form submission errors
- Accessibility compliance
- Professional form behavior

#### 5. **Backend API Enhancements**

**New Endpoints**:
- `GET /api/user-register` - Paginated list with search and sorting
- `GET /api/user-register/check-email` - Email existence validation
- `POST /api/user-register` - Enhanced with duplicate email prevention
- `POST /api/auth/register` - User registration endpoint

**Query Parameters**:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `search`: Search term (searches email, cédula, university, career)
- `sortBy`: Field to sort by (default: createdAt)
- `sortOrder`: asc or desc (default: desc)

**Why**:
- Efficient data retrieval with pagination
- Better API design following REST principles
- Scalable backend architecture
- Flexible querying capabilities

#### 6. **Model Improvements**

**Enhanced Schema**:
- Email field: `unique: true`, `lowercase: true`, `trim: true`
- Age field: `min: 1`, `max: 120`
- Gender field: `enum` validation
- Automatic duplicate prevention at database level

**Why**:
- Data integrity at the database level
- Consistent data format (lowercase emails)
- Prevents invalid data entry
- Better error handling

#### 7. **Improved Navigation & UX**

**New Features**:
- Clear navigation between pages
- "Agregar Usuario" button prominently displayed
- Logout button in header
- Breadcrumb-style navigation
- Automatic redirects after actions

**Why**:
- Intuitive user flow
- Easy access to common actions
- Clear visual hierarchy
- Professional application feel

#### 8. **Code Organization**

**Structure**:
- Separated concerns (list vs create)
- Reusable service layer
- Type-safe interfaces
- Component-based architecture

**Why**:
- Easier to maintain
- Better code reusability
- Type safety reduces bugs
- Scalable architecture

## 🔧 Configuration

### API Base URL

The API base URL can be configured via environment variables. Create a `.env` file:

```env
PUBLIC_API_BASE=http://localhost:4000/api
```

If not set, it defaults to `http://localhost:4000/api`.

## 📝 API Endpoints

### Authentication Endpoints

#### POST `/api/auth/register`
Register a new user account.

**Body**:
```json
{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "password123"
}
```

**Response** (201 Created):
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "...",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

**Error** (409 Conflict):
```json
{
  "error": "Email ya registrado"
}
```

#### POST `/api/auth/login`
Login with existing credentials.

**Body**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response**:
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "...",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

### User Register Endpoints

#### GET `/api/user-register`
Get paginated list of users with search and sorting.

**Query Parameters**:
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `search` (string): Search term
- `sortBy` (string): Field to sort by
- `sortOrder` (string): 'asc' or 'desc'

**Response**:
```json
{
  "items": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

#### POST `/api/user-register`
Create a new user register.

**Body**:
```json
{
  "email": "user@example.com",
  "cedula": "1234567890",
  "edad": 25,
  "genero": "masculino",
  "so": "windows",
  "movilidad": "Transporte público",
  "tiempoDiario": "4 horas",
  "universidad": "Universidad de Cuenca",
  "carrera": "Ingeniería",
  "telefono": "0987654321"
}
```

**Response** (201 Created):
```json
{
  "_id": "...",
  "email": "user@example.com",
  ...
}
```

**Error** (409 Conflict):
```json
{
  "error": "El correo electrónico ya está registrado"
}
```

#### GET `/api/user-register/check-email`
Check if an email already exists.

**Query Parameters**:
- `email` (string, required): Email to check

**Response**:
```json
{
  "exists": true
}
```

## 🎨 Styling

The application uses a modern CSS approach with:
- CSS Custom Properties for theming
- Mobile-first responsive design
- Dark mode support via `prefers-color-scheme`
- High contrast mode support
- Reduced motion support for accessibility
- Consistent spacing and typography system

## ♿ Accessibility

The application follows WCAG 2.1 guidelines:
- Semantic HTML structure
- Proper ARIA labels and roles
- Keyboard navigation support
- Screen reader friendly
- Focus management
- High contrast support
- Form validation with accessible error messages

## 🛠️ Development Notes

- Components use Astro's component-based architecture
- Services are written in TypeScript for type safety
- All API calls include proper error handling
- Token management uses localStorage (consider security implications for production)
- Real-time validation uses debouncing to reduce API calls
- Pagination state is managed client-side for smooth UX
- Table implementation uses vanilla JavaScript (no external dependencies)

## 🐛 Troubleshooting

### Email validation not working
- Check that the backend is running
- Verify API_BASE URL is correct
- Check browser console for errors

### Pagination not showing
- Ensure backend returns pagination object
- Check that total count is greater than limit

### Search not working
- Verify search parameter is being sent
- Check backend logs for query issues

### Registration form not submitting
- Check that all required fields are filled
- Verify password and confirmation match
- Check browser console for validation errors

## 📄 License

See the main project LICENSE file.

## 🚀 Migration from v2.0

If you're migrating from v2.0:

1. **Removed Tabulator**: The table now uses vanilla JavaScript - no external dependencies needed
2. **Registration Form**: New tab-based registration form replaces demo user button
3. **Dependencies**: Removed `tabulator-tables` and `@types/tabulator-tables` from package.json
4. **Table Implementation**: Table is now implemented directly in `/users/index.astro`

## 📊 Performance Considerations

- Pagination reduces initial load time
- Search is debounced to reduce API calls
- Email validation is debounced (500ms delay)
- Table rendering is optimized for large datasets
- Responsive design ensures good performance on mobile devices
- No external table library reduces bundle size
