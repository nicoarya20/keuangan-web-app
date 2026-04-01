import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    // baseURL harus mengarah ke port 3001 (tempat server berjalan)
    // agar internal callback generator tahu port aslinya
    baseURL: "http://localhost:3001",
    basePath: "/api/auth",
    trustedOrigins: ["http://localhost:5173"],
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
    },
});
