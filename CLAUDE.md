# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the frontend of an e-commerce platform built with Next.js 16 and React 19. It's designed to work with a Spring Boot backend that provides a PC e-commerce API.

**Technology Stack:**
- Next.js 16 with App Router
- React 19 with TypeScript
- Redux Toolkit for state management
- Tailwind CSS for styling
- NextAuth.js for authentication
- React Hot Toast for notifications
- Swiper for carousels
- Axios for API communication

## Development Commands

```bash
# Development
npm run dev          # Start development server on http://localhost:3000
npm run build        # Build production application
npm run start        # Start production server
npm run lint         # Run ESLint for code quality

# Package management
npm install          # Install dependencies
npm install <package> # Add new dependency
```

## Architecture Overview

### App Router Structure
```
src/app/
├── (site)/              # Site layout group
│   ├── layout.tsx       # Main layout with providers
│   └── page.tsx         # Homepage
└── context/             # React Context providers
    ├── CartSidebarModalContext.tsx
    ├── PreviewSliderContext.tsx
    └── QuickViewModalContext.tsx
```

### State Management
The application uses Redux Toolkit with the following slices:
- **cart-slice**: Shopping cart functionality
- **wishlist-slice**: Product wishlist management
- **quickView-slice**: Quick product preview modal
- **product-details**: Product details state
- **user-slice**: User authentication and profile data

### Key Components Structure
```
src/components/
├── Common/              # Reusable components
│   ├── CartSidebarModal/
│   ├── QuickViewModal/
│   ├── PreviewSlider/
│   └── ProductItem.tsx
├── Header/              # Navigation components
├── Footer/              # Footer components
├── Home/                # Homepage sections
├── Shop/                # Product listing components
├── ShopWithSidebar/     # Product listing with filters
├── Cart/                # Shopping cart components
├── Checkout/            # Checkout flow components
├── MyAccount/           # User account management
├── Auth/                # Login/register components
├── Orders/              # Order management
├── Wishlist/            # Wishlist functionality
└── Blog/                # Blog related components
```

### Backend Integration
- **API Base URL**: http://localhost:8080/api
- **Generated Types**: TypeScript interfaces are auto-generated from OpenAPI specs in `generated-typescript/`
- **Authentication**: JWT-based with token storage in localStorage
- **API Client**: Uses auto-generated API client with Axios

### Configuration Files
- **TypeScript**: Strict mode disabled, path aliases configured (`@/*` → `./src/*`)
- **Tailwind**: Custom color palette, spacing, and component classes
- **Next.js**: Standard configuration with App Router

## Key Patterns

### Authentication Flow
1. Uses `AuthContext` with Redux for user state management
2. JWT tokens stored in localStorage
3. Auto-refresh user session on app load
4. Protected routes using `withAuth` HOC

### API Integration
```typescript
// Import generated types
import { AuthControllerApi, LoginRequestDTO } from '../generated-typescript';

// Use auth service
import { authService } from '../services/auth';
```

### Styling Approach
- Tailwind CSS with custom theme
- Custom color palette (blue, red, green, yellow variants)
- Extended spacing and font sizes
- Custom shadow utilities
- Responsive design with mobile-first approach

### State Management Pattern
- Redux Toolkit for global state
- React Context for UI state (modals, sidebar visibility)
- Component state for local UI interactions

## Development Flow & Rules

### **IMPORTANT: Implementation Order Rule**
All new features and implementations must follow this strict order:

1. **generated-typescript/** → Auto-generated types from OpenAPI (NEVER edit manually)
2. **src/types/** → Extend or customize generated types for frontend use
3. **src/services/** → API service functions using generated types
4. **src/redux/features/** → Redux slices (only if state management is needed)
5. **Components** → Only create new components if functionality requires them

### Implementation Flow Example (Login Flow):
```typescript
// 1. generated-typescript/models/login-request-dto.ts (AUTO-GENERATED)
export interface LoginRequestDTO {
  email: string;
  password: string;
}

// 2. src/types/auth.ts (EXTEND GENERATED TYPES)
import { LoginRequestDTO, RegisterRequest } from '../../generated-typescript';

export interface LoginForm extends LoginRequestDTO {
  rememberMe?: boolean;
}

export interface User {
  // Extend with frontend-specific fields
}

// 3. src/services/auth.ts (API SERVICE)
import { AuthControllerApi, Configuration, LoginRequestDTO } from '../../generated-typescript';

export const authService = {
  async login(credentials: LoginRequestDTO) {
    // API calls using generated client
  }
};

// 4. src/redux/features/user-slice.ts (ONLY IF NEEDED)
import { User } from '../../types/auth';

const userSlice = createSlice({
  // Redux state management
});

// 5. Components (ONLY CREATE IF NEEDED)
// Use existing auth components unless new functionality is required
```

### When to Create New Components
- **DO NOT** create new components if existing ones can be adapted
- **DO** create new components only when:
  - Completely new UI functionality is required
  - Existing components cannot be easily extended
  - Component would be reused in multiple places

### Adding New Features - Step by Step:

1. **Check generated-typescript/** first - always use auto-generated types
2. **Extend in src/types/** only if you need frontend-specific extensions
3. **Create service in src/services/** for all API communication
4. **Add Redux slice** only if you need global state management
5. **Create/modify components** as the last step, and only if necessary

### API Integration Guidelines
- Always import types from `generated-typescript/` first
- Extend types in `src/types/` for frontend-specific needs
- Use generated API client classes for all HTTP requests
- Error handling should be consistent with existing auth service patterns
- Store tokens in localStorage via auth service

### Styling Guidelines
- Use Tailwind utility classes
- Follow the established color palette and spacing
- Maintain responsive design patterns
- Use existing component patterns for consistency