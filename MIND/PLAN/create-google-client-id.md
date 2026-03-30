# Plan: Create Google Client ID Step-by-Step

This document provides a comprehensive guide for generating a Google OAuth 2.0 Client ID to be used in the personal finance web application.

## Prerequisites
- A Google Account (Gmail/Google Workspace).
- The local development URL (usually `http://localhost:5173` for Vite).

## Step-by-Step Instructions

### 1. Google Cloud Console Setup
- [x] Go to the [Google Cloud Console](https://console.cloud.google.com/).
- [x] Sign in with your Google Account.
- [x] Click on the **Project Dropdown** (top left) and select **New Project**.
- [x] Enter a **Project Name** (e.g., "Web-App-Keuangan") and click **Create**.
- [x] Ensure your new project is selected in the top dropdown.

### 2. Configure OAuth Consent Screen
- [x] In the left sidebar, navigate to **APIs & Services** > **OAuth consent screen**.
- [x] Select **User Type**:
    - Choose **External** (if you want any Google user to log in).
    - Click **Create**.
- [x] Fill in the **App Information**:
    - **App name**: Personal Finance App.
    - **User support email**: Your email address.
    - **Developer contact information**: Your email address.
- [x] Click **Save and Continue** through the "Scopes" and "Test users" steps (you can add your own email as a test user if needed).
- [x] Click **Back to Dashboard**.

### 3. Create OAuth 2.0 Credentials
- [x] In the left sidebar, click on **Credentials**.
- [x] Click **+ Create Credentials** at the top and select **OAuth client ID**.
- [x] Select **Application type**: **Web application**.
- [x] Enter a **Name**: Web Client 1.
- [x] Under **Authorized JavaScript origins**, click **+ Add URI** and enter:
    - `http://localhost:5173`
- [x] Under **Authorized redirect URIs**, click **+ Add URI** and enter:
    - `http://localhost:5173`
- [x] Click **Create**.
- [x] A popup will appear showing your **Client ID** and **Client Secret**. **Copy the Client ID**.

### 4. Application Configuration
- [x] Create a `.env` file in your project root (if it doesn't exist).
- [x] Add the following line:
  ```env
  VITE_GOOGLE_CLIENT_ID=your_actual_client_id_here
  ```
- [x] Replace `your_actual_client_id_here` with the ID you copied from the console.

### 5. Verify the Implementation
- [x] Restart your development server (`npm run dev`).
- [x] Go to the login page and test the "Login with Google" button.

## Security Notes
- **Never** commit your `.env` file to version control (it is already in `.gitignore`).
- For production, you will need to add your production domain to the **Authorized JavaScript origins** and **Authorized redirect URIs** in the Google Cloud Console.
