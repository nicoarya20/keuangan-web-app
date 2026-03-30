# Plan: Implement Google Authentication Login

Add a login page with Google Authentication using `@react-oauth/google` to protect the application's routes and provide a personalized experience.

## Research & Setup
- [x] Analyze existing codebase structure (React Router v7, Context API, Tailwind CSS).
- [ ] Install necessary dependencies: `@react-oauth/google` and `jwt-decode`.
- [ ] Determine where to store user information (AuthContext and LocalStorage).

## Implementation Strategy

### 1. Authentication Context
- Create `src/app/context/AuthContext.tsx` to manage user state.
- Implement login and logout functionality.
- Persist user data in `localStorage`.

### 2. Login Page
- Create `src/app/pages/LoginPage.tsx`.
- Design a clean, modern login interface using Tailwind CSS and Radix UI.
- Integrate the `GoogleLogin` component from `@react-oauth/google`.

### 3. Route Protection
- Create a `ProtectedRoute` component to wrap authenticated routes.
- Update `src/app/routes.ts` to include the new login route and protect existing ones.
- Redirect unauthenticated users to the `/login` page.

### 4. UI Enhancements
- Update `src/app/components/Sidebar.tsx` or `src/app/components/Topbar.tsx` to show the logged-in user's profile picture and name.
- Add a logout button to the UI.

### 5. Final Polishing
- Handle loading states during authentication.
- Add success/error notifications using `sonner`.
- Ensure a smooth transition between the login page and the dashboard.

## Verification Plan
- [ ] Verify that unauthenticated users are redirected to the login page.
- [ ] Verify successful Google login and redirection to the dashboard.
- [ ] Verify that user information is correctly displayed in the UI.
- [ ] Verify that logout works and clears the user's session.
- [ ] Test the application across different screen sizes.
