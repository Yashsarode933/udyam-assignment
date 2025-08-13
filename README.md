# Udyam Assignment Platform

A comprehensive full-stack platform for managing and processing Udyam registration assignments with automated scraping, validation, and processing capabilities.

## 🏗️ Architecture Overview

This is a **monorepo** project built with modern technologies:

### **Frontend**
- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Features**: Server-side rendering, API routes, responsive design

### **Backend**
- **Runtime**: Node.js with Express
- **ORM**: Prisma with SQLite (dev) / PostgreSQL (prod)
- **Language**: TypeScript
- **Database**: Schema-first approach with migrations

### **Scraper Service**
- **Language**: TypeScript
- **Purpose**: Automated data extraction and processing
- **Integration**: Standalone service for data collection

### **Shared Components**
- **Schemas**: Type-safe data validation
- **Utilities**: Common functions and types

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Docker (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone [YOUR-REPO-URL]
   cd udyam-assignment
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Backend
   cp apps/backend/.env.example apps/backend/.env
   
   # Frontend
   cp apps/frontend/.env.example apps/frontend/.env
   ```

4. **Database setup**
   ```bash
   cd apps/backend
   npx prisma migrate dev
   npx prisma db seed
   ```

5. **Start development servers**
   ```bash
   # Start all services
   npm run dev
   
   # Or start individually
   npm run dev:frontend
   npm run dev:backend
   npm run dev:scraper
   ```

## 📁 Project Structure

```
udyam-assignment/
├── apps/
│   ├── backend/          # Express API server
│   │   ├── src/
│   │   ├── prisma/       # Database schema & migrations
│   │   └── test/
│   ├── frontend/         # Next.js application
│   │   ├── src/app/      # App router pages
│   │   └── public/
│   └── scraper/          # Data scraping service
├── shared/               # Shared utilities & schemas
│   ├── schemas/
│   └── utils/
├── docker-compose.yml    # Docker development setup
└── package.json         # Workspace configuration
```

## 🛠️ Available Scripts

- `npm run dev` - Start all services in development
- `npm run build` - Build all applications
- `npm run test` - Run all tests
- `npm run lint` - Lint all code
- `npm run clean` - Clean all build artifacts

## 🐳 Docker Support

```bash
# Development with hot reload
docker-compose up

# Production build
docker-compose -f docker-compose.prod.yml up
```

## 🔧 Environment Variables

### Backend
```env
DATABASE_URL="file:./dev.db"
PORT=3001
NODE_ENV=development
```

### Frontend
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run specific workspace tests
npm run test:backend
npm run test:frontend
```

## 📊 Tech Stack

| Component | Technology |
|-----------|------------|
| Frontend | Next.js 14, TypeScript, Tailwind CSS |
| Backend | Node.js, Express, Prisma, TypeScript |
| Database | SQLite (dev), PostgreSQL (prod) |
| DevOps | Docker, Docker Compose |
| Testing | Jest, React Testing Library |
| Linting | ESLint, Prettier |

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
