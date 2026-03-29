# Plan: Mobile Responsive Improvements

This plan outlines the steps to make the entire application (all features and menus) responsive for mobile devices.

## Objective
Ensure a seamless and user-friendly experience on mobile devices (320px - 768px) across all pages and features.

## Key Areas of Improvement
1.  **Layout & Navigation:**
    *   Smooth transition for the sidebar on mobile.
    *   Proper padding and alignment in `RootLayout`, `Topbar`, and `Sidebar`.
2.  **Dashboard:**
    *   Responsive chart sizing and legend placement.
    *   Adjusting stats card padding and font size for small screens.
3.  **Income & Expenses Pages:**
    *   Stacking headers on mobile (Title and "Add" button).
    *   Transforming transaction list items into a card-like layout for mobile.
4.  **Savings & Wishlist Pages:**
    *   Responsive progress bars and item details.
    *   Grid adjustments for mobile views.
5.  **Common UI Components:**
    *   Ensuring Dialogs and Inputs are full-width and accessible on mobile.
    *   Adjusting spacing and font sizes for better readability on small screens.

## Implementation Steps
1.  Update `RootLayout.tsx`, `Sidebar.tsx`, and `Topbar.tsx` to handle transitions and padding better.
2.  Update `Dashboard.tsx` to ensure charts and stats are responsive.
3.  Update `IncomePage.tsx` and `ExpensesPage.tsx` to handle transaction lists and headers for mobile.
4.  Update `SavingsPage.tsx` and `WishlistPage.tsx` to be mobile-friendly.
5.  Check common UI components (Dialogs, Cards, Buttons) for mobile-first styles.

## Verification
- Test all pages on multiple viewports (iPhone SE, iPhone 12 Pro, Pixel 7, iPad Air).
- Ensure the sidebar opens and closes correctly on mobile.
- Verify all buttons and inputs are easily tappable and accessible.
