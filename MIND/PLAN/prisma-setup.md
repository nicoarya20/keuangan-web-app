# Plan: Prisma Setup and Schema Modeling

This plan outlines the steps to integrate Prisma and define the database schema for the personal finance application.

## Objective
Replace LocalStorage-based persistence with a robust database using Prisma ORM.

## Architecture & Technology
- **ORM:** Prisma
- **Database:** SQLite (Ideal for local development and prototypes)
- **Models:** Income, Expense, WishlistItem, Saving, CategoryBudget.

## Implementation Steps
1.  **Install Prisma Dependencies:**
    - Install `prisma` as a dev dependency.
    - Install `@prisma/client` as a regular dependency.
2.  **Initialize Prisma:**
    - Initialize Prisma with SQLite as the provider.
3.  **Define Schema:**
    - Create models in `prisma/schema.prisma` based on existing interfaces:
        - `Income`: id, amount, category, date, recurring, note.
        - `Expense`: id, amount, category, date, note, tags (as String).
        - `WishlistItem`: id, name, targetPrice, currentProgress, priority, note.
        - `Saving`: id, amount, goalName, date, type.
        - `CategoryBudget`: id, category, amount.
4.  **Generate Client:**
    - Run `npx prisma generate` to create the Prisma Client.
5.  **Initial Migration:**
    - Run `npx prisma migrate dev` to create the database and tables.

## Verification
- Verify `prisma/schema.prisma` exists and contains all models.
- Verify `dev.db` is created after migration.
- Verify Prisma Client can be imported.
