# Architecture Overview

## System Design

- Single Next.js application handling both frontend and backend
- MongoDB for data persistence
- DevCycle for feature flag management

## Core Components

1. **API Layer** (`app/api/`)
   - REST endpoints for RSS feeds, user data, and gamification
   - Feature flag controlled endpoints

2. **Database Layer** (`app/lib/db/`)
   - MongoDB connection
   - Data models and schemas
   - Query utilities

3. **Feature Flags** (`app/lib/devcycle/`)
   - Flag configurations
   - Integration utilities
   - A/B testing setup

4. **UI Components** (`app/components/`)
   - Reusable UI elements
   - Feature-flagged components
   - Layout system
