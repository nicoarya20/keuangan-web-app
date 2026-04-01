import { createBrowserRouter } from 'react-router';
import { RootLayout } from './layouts/RootLayout';
import { Dashboard } from './pages/Dashboard';
import { IncomePage } from './pages/IncomePage';
import { ExpensesPage } from './pages/ExpensesPage';
import { WishlistPage } from './pages/WishlistPage';
import { SavingsPage } from './pages/SavingsPage';
import LoginPage from './pages/LoginPage';

export const router = createBrowserRouter([
  {
    path: '/login',
    Component: LoginPage,
  },
  {
    path: '/',
    Component: RootLayout,
    children: [
      { index: true, Component: Dashboard },
      { path: 'income', Component: IncomePage },
      { path: 'expenses', Component: ExpensesPage },
      { path: 'wishlist', Component: WishlistPage },
      { path: 'savings', Component: SavingsPage },
    ],
  },
]);
