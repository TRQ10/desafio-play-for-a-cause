
import { NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials"


export const url = process.env.NEXT_PUBLIC_SERVER_URI

async function refreshToken(token: JWT): Promise<JWT> {
    try {
        const res = await fetch(url + '/auth/refresh', {
            method: "POST",
            headers: {
                authorization: `Refresh ${token.backendTokens.refreshToken}`,
            },
        });

        if (!res.ok) {
            throw new Error(`Failed to refresh token: ${res.status} - ${res.statusText}`);
        }

        console.log("refreshed");

        const response = await res.json();
        return {
            ...token,
            backendTokens: response,
        };


    } catch (error) {
        console.error("Error refreshing token:", error);
        throw error;
    }
}

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                name: { label: "Username", type: "text", placeholder: "tiago" },
                senha: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                try {
                    if (!credentials?.name || !credentials?.senha) return null;
                    console.log(credentials)
                    const { name, senha } = credentials;
                    const res = await fetch(`${url}/auth/login`, {
                        method: "POST",
                        body: JSON.stringify({
                            name,
                            senha,
                        }),
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });

                    if (res.status === 401) {
                        console.log(res.statusText);
                        return null;
                    }

                    const user = await res.json();
                    return user;
                } catch (error) {
                    console.error("Error in authorize function:", error);
                    throw error;
                }
            }
        })
    ],
    pages: {
        signIn: "/login"
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) return { ...token, ...user };

            return token;

        },

        async session({ token, session }) {
            session.user = token.user;
            session.backendTokens = token.backendTokens;
            return session;
        }
    },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST };