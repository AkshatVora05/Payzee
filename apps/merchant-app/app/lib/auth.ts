import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import { prisma } from "@repo/db";
import { Session, User, Account } from "next-auth";
import { JWT } from "next-auth/jwt";

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || ""
        }),
        GithubProvider({
            clientId: process.env.GITHUB_CLIENT_ID || "",
            clientSecret: process.env.GITHUB_CLIENT_SECRET || ""
        })
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async signIn({ user, account }: { user: User; account: Account | null }) {
            if (!user || !user.email) {
                console.error("SignIn Failed: Missing User or Email in OAuth payload.", user);
                return false;
            }

            try {
                const existingMerchant = await prisma.merchant.findUnique({
                    where: { email: user.email }
                });

                if (!existingMerchant) {
                    await prisma.merchant.create({
                        data: {
                            email: user.email,
                            name: user.name || "",
                            auth_type: account?.provider === "google" ? "Google" : "Github"
                        }
                    });
                }
                return true;
            } catch (e) {
                console.error("Prisma Error during Merchant SignIn:", e);
                return false;
            }
        },
        async session({ token, session }: { token: JWT; session: Session }) {
            if (session.user && token.sub) {
                (session.user as { id?: string }).id = token.sub;
            }
            return session;
        }
    },
    pages: {
        signIn: '/auth/signin',
    }
}