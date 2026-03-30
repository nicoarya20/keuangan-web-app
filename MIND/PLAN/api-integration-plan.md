# Plan: API Implementation and UI Integration

## Project Overview
Transitioning the current personal finance web application from LocalStorage-based persistence to a robust backend API using ElysiaJS and Prisma (PostgreSQL).

## Features to Implement
1.  **Backend API (ElysiaJS)**
    *   `GET /api/incomes`: Fetch all incomes.
    *   `POST /api/incomes`: Add a new income.
    *   `DELETE /api/incomes/:id`: Delete an income.
    *   `GET /api/expenses`: Fetch all expenses.
    *   `POST /api/expenses`: Add a new expense.
    *   `DELETE /api/expenses/:id`: Delete an expense.
    *   `GET /api/wishlist`: Fetch all wishlist items.
    *   `POST /api/wishlist`: Add a new wishlist item.
    *   `PATCH /api/wishlist/:id`: Update wishlist item progress/details.
    *   `DELETE /api/wishlist/:id`: Delete a wishlist item.
    *   `GET /api/savings`: Fetch all savings/investments.
    *   `POST /api/savings`: Add a new saving.
    *   `DELETE /api/savings/:id`: Delete a saving.
    *   `GET /api/budgets`: Fetch all category budgets.
    *   `POST /api/budgets`: Set or update a category budget.

2.  **Frontend Integration**
    *   Update `FinanceContext.tsx` to use `fetch` for all operations.
    *   Implement loading states and error handling (Sonner notifications).
    *   Sync initial data from API on app load.

## Technical Stack
*   **Backend:** ElysiaJS, Prisma ORM, PostgreSQL (Supabase).
*   **Frontend:** React, Context API, Lucide Icons, Sonner.

## Development Steps
1.  Initialize ElysiaJS server.
2.  Set up Prisma client and connect to database.
3.  Create routes for each financial module.
4.  Test API endpoints using `curl` or Bun test.
5.  Refactor `FinanceContext.tsx` to replace LocalStorage logic with API calls.
6.  Verify UI updates and data persistence.
