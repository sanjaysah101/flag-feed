# Development Guide

## Setup

1. Clone repository
2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Set up environment variables:

   ```bash
   cp .env.example .env.local
   ```

4. Configure DevCycle SDK
5. Start development server:

   ```bash
   pnpm dev
   ```

## Development Workflow

1. Create feature branch
2. Implement changes
3. Add tests
4. Create pull request

## Feature Flag Development

- Always provide fallback values
- Document flag purposes
- Test both flag states
