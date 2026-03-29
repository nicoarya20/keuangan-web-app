# Project Overview: Buat Web-App Keuangan

A comprehensive personal finance web application built with React, Vite, and Tailwind CSS. The app allows users to track incomes, expenses, savings, and maintain a wishlist, with data persisted via LocalStorage.

## Core Technologies
- **Framework:** React 18 (Vite-powered)
- **Routing:** React Router v7
- **Styling:** Tailwind CSS v4, Radix UI (base for accessible components)
- **State Management:** React Context API (with LocalStorage persistence)
- **Data Visualization:** Recharts
- **Icons:** Lucide React
- **Notifications:** Sonner
- **Animations:** Motion

## Project Architecture
The project follows a modular structure focused on clarity and scalability:

- `src/main.tsx`: Entry point that renders the `App` component.
- `src/app/App.tsx`: Top-level component wrapping the application with `FinanceProvider` and `RouterProvider`.
- `src/app/routes.ts`: Defines the application's routing structure.
- `src/app/context/FinanceContext.tsx`: Core state management for incomes, expenses, wishlist, savings, and budgets.
- `src/app/layouts/`: Layout components like `RootLayout.tsx` (Sidebar, Topbar).
- `src/app/pages/`: Feature-specific page components (Dashboard, Income, Expenses, Savings, Wishlist).
- `src/app/components/`: Reusable UI components in `ui/` following the Shadcn UI pattern.

## Building and Running
- **Install Dependencies:** `npm install`
- **Start Development Server:** `npm run dev`
- **Build for Production:** `npm run build`

## Development Conventions
- **State Management:** Use the `useFinance` hook to interact with global financial data.
- **Component Design:** Modular, focused components using Tailwind CSS for styling. Generic UI elements reside in `src/app/components/ui/`.
- **Routing:** Add new paths to `src/app/routes.ts`.
- **Icons:** Use `lucide-react`.
- **Charts:** Use `recharts`.
- **Data Persistence:** Managed via `LocalStorage` in `FinanceProvider`.
