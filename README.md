# 🛒 E-Commerce Product Dashboard

A modern, responsive web application built with Angular 18+ for managing e-commerce products. Features a clean interface, advanced filtering, real-time search, and comprehensive CRUD operations.

![Angular](https://img.shields.io/badge/Angular-18+-red?style=flat-square&logo=angular)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8+-blue?style=flat-square&logo=typescript)
![NgRx](https://img.shields.io/badge/NgRx-20+-purple?style=flat-square&logo=ngrx)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4+-cyan?style=flat-square&logo=tailwindcss)
![JSON Server](https://img.shields.io/badge/JSON%20Server-Mock%20API-green?style=flat-square)

## ✨ Features

### 🎯 Core Functionality
- **Product Management**: Complete CRUD operations (Create, Read, Update, Delete)
- **Advanced Search**: Real-time search by product name and description
- **Smart Filtering**: Filter by product status (Active/Inactive/All)
- **Dynamic Sorting**: Sort by name, price, stock, or creation date (ASC/DESC)
- **Pagination**: Efficient data loading with customizable page sizes
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

### 🎨 User Experience
- **Dark/Light Theme**: Toggle between themes with system preference detection
- **Loading States**: Skeleton screens and loading indicators
- **Error Handling**: Comprehensive error messages and retry mechanisms
- **Success Notifications**: Toast messages for user actions
- **Form Validation**: Real-time validation with clear error messages
- **Image Upload**: File upload with preview and validation

### 🚀 Technical Features
- **State Management**: Professional NgRx implementation with Actions, Effects, Reducers
- **Performance Optimized**: Lazy loading, OnPush change detection, memoization
- **Type Safety**: Full TypeScript implementation with strict typing
- **Testing Ready**: Comprehensive test setup with Jasmine and Karma
- **Modern Architecture**: Feature-based folder structure and standalone components

## 🖥️ Screenshots

### Desktop View
*Desktop table view with all product information and actions*

### Mobile View
*Mobile-optimized card layout for touch interactions*

### Product Form
*Clean, validated form for adding and editing products*

### Dark Mode
*Beautiful dark theme with proper contrast and accessibility*

## 🛠️ Technology Stack

- **Frontend Framework**: Angular 18+
- **State Management**: NgRx 20+
- **Styling**: TailwindCSS 3.4+
- **Language**: TypeScript 5.8+
- **Mock API**: JSON Server 1.0+
- **Testing**: Jasmine & Karma
- **Build Tool**: Angular CLI 20+

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm (v8 or higher)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd ecommerce-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development environment**
   ```bash
   npm run dev
   ```
   This command runs both the Angular app and JSON Server concurrently:
   - Angular app: http://localhost:4200
   - JSON Server API: http://localhost:3000

### Alternative Commands

- **Start Angular only**: `npm start` or `ng serve`
- **Start API only**: `npm run server`
- **Build for production**: `npm run build`
- **Run tests**: `npm test`

## 📁 Project Structure

```
src/
├── app/
│   ├── core/                 # Core services and utilities
│   │   └── services/         # HTTP services, theme, toast
│   ├── features/             # Feature modules
│   │   └── products/         # Product management feature
│   │       ├── components/   # Product (list, form)
│   │       └── store/        # NgRx store (actions, effects, reducers)
│   ├── shared/               # Shared components and models
│   │   ├── components/       # Reusable UI components
│   │   └── models/           # TypeScript interfaces
│   └── store/                # Global app state
├── db.json                   # Mock database for JSON Server
└── ...
```

## 🔌 API Endpoints

The mock API provides the following endpoints:

### Products
- `GET /products` - Get all products with filtering, sorting, and pagination
- `GET /products/:id` - Get a single product by ID
- `POST /products` - Create a new product
- `PUT /products/:id` - Update an existing product
- `DELETE /products/:id` - Delete a product

### Query Parameters for GET /products
```
?search=<term>          # Search by name or description
&status=<active|inactive|all>  # Filter by status
&sortField=<name|price|stock|createdAt>  # Sort field
&sortOrder=<asc|desc>   # Sort direction
&page=<number>          # Page number
&limit=<number>         # Items per page
```

### Example Requests
```bash
# Get all active products
GET /products?status=active

# Search for "laptop" with pagination
GET /products?search=laptop&page=1&limit=10

# Sort by price descending
GET /products?sortField=price&sortOrder=desc
```

## 🎯 Product Model

```typescript
interface Product {
  id: number | string;
  name: string;                    // 3-100 characters, required
  description?: string;            // Optional, max 500 characters
  price: number;                   // Required, > 0
  stock: number;                   // Required, >= 0
  status: 'active' | 'inactive';   // Required
  image?: string;                  // Optional image URL
  createdAt?: string;              // Auto-generated timestamp
  updatedAt?: string;              // Auto-generated timestamp
}
```

## 🧪 Testing

Run the test suite:
```bash
npm test
```

The project includes comprehensive tests for:
- Components (unit tests)
- Services (integration tests)
- Store (NgRx state management)
- User interactions (component integration)

## 🎨 Theming

The application supports both light and dark themes:
- **Auto-detection**: Respects system preference on first visit
- **Manual toggle**: Theme switch in the header
- **Persistence**: Remembers user preference in localStorage
- **Smooth transitions**: Animated theme switching

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 768px (Card layout)
- **Tablet**: 768px - 1024px (Responsive table)
- **Desktop**: > 1024px (Full table layout)

### Features by Device
- **Mobile**: Touch-optimized cards, simplified navigation
- **Tablet**: Hybrid layout with essential columns
- **Desktop**: Full feature set with all columns and actions

## ⚡ Performance Optimizations

- **Lazy Loading**: Images load only when visible
- **OnPush Strategy**: Optimized change detection
- **TrackBy Functions**: Efficient list rendering
- **Memoized Selectors**: Cached state computations
- **Bundle Optimization**: Tree-shaking and code splitting

## 🔧 Development Workflow

### Code Organization
- **Feature-based structure**: Organized by business domains
- **Standalone components**: Modern Angular architecture
- **Strict TypeScript**: Full type safety
- **Consistent naming**: Clear, descriptive naming conventions

### State Management
- **NgRx Pattern**: Actions → Effects → Reducers → Selectors
- **Immutable updates**: Pure functions and immutable state
- **Error handling**: Centralized error management
- **Loading states**: Comprehensive loading indicators

### Best Practices
- **Reactive forms**: Template-driven validation
- **HTTP interceptors**: Centralized request/response handling
- **Service injection**: Dependency injection pattern
- **Component communication**: Input/Output and services

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Angular team for the amazing framework
- NgRx team for state management solutions
- TailwindCSS for utility-first CSS framework
- JSON Server for quick API mocking

## 📞 Support

If you have any questions or need help with setup, please open an issue or contact the development team.

---

**Made with ❤️ using Angular 18+ and modern web technologies**
