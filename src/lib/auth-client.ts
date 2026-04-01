import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
    baseURL: import.meta.env.VITE_BETTER_AUTH_URL || (import.meta.env.VITE_API_URL 
        ? import.meta.env.VITE_API_URL.split('/api')[0] 
        : (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3001'))
})
