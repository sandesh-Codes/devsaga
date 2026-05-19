import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github";
import { prisma } from "@/lib/db"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { signIn } from "next-auth/react";

export const authOptions = {
    adapter: PrismaAdapter(prisma),

    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            httpOptions: {
                timeout: 30000,
            },
            allowDangerousEmailAccountLinking: true,
        }),

        GitHubProvider({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            httpOptions: {
                timeout: 30000,
            },
            allowDangerousEmailAccountLinking: true,
        }),
    ],

    session: {
        strategy: "database"
    },

    pages: {
        signIn: "/login"
    },

    callbacks: {
        async session({ session, user }) {
            session.user.id = user.id
            return session
        }
    }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }