import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt"

declare module "next-auth" {

    interface Session {
        user: {
            id: number;
            email: string;
            name: string;
            picture: string;
        };

        backendTokens: {
            token: string;
            refreshToken;
            expiresIn: number;
        }
    }
}

declare module "next-auth/jwt" {

    interface JWT {
        user: {
            id: number
            email: string
            name: string
            picture: string
        };

        backendTokens: {
            token: string
            refreshToken: string
            expiresIn: number
        };
    }

}
