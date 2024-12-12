# Architecture Overview

## System Design

- Next.js 15 application with App Router
- Supabase for database and real-time features
- DevCycle for feature flag management
- Prisma as ORM with PostgreSQL
- Tailwind CSS for styling with shadcn/ui components

## Core Components

1. **API Layer** (`app/api/`)

   - REST endpoints for RSS feeds
   - Real-time quiz competitions
   - Gamification services
   - Feature flag controlled endpoints

2. **Database Layer**

   - Prisma with Supabase PostgreSQL
   - Real-time subscriptions
   - Row Level Security
   - Type-safe queries

3. **UI Components** (`src/components/`)

   - Reusable shadcn/ui components
   - Feature-flagged components
   - Real-time updates
   - Dark mode support
   - Responsive design

4. **Feature Flags** (`lib/devcycle/`)
   - Server and client-side flags
   - Progressive feature rollouts
   - A/B testing configuration
   - Analytics integration

## Data Flow

1. **RSS Processing**
   `mermaid graph LR A[RSS Sources] --> B[Parser] B --> C[Category Detection] C --> D[Database] D --> E[Real-time Updates]`

2. **Feature Flag Flow**
   `mermaid graph LR A[DevCycle SDK] --> B[Flag Evaluation] B --> C[Feature Toggle] C --> D[Analytics]`

## Integration Points

1. **Supabase**

   - Authentication
   - Real-time subscriptions
   - Database operations
   - Storage (future use)

2. **DevCycle**
   - Feature flag management
   - A/B testing
   - Progressive rollouts
   - Usage analytics
