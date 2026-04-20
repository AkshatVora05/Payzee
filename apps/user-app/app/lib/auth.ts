import { prisma } from "@repo/db";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { SigninInput } from "@repo/common";
import { Session } from "next-auth";
import { JWT } from "next-auth/jwt";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email", placeholder: "user@example.com" },
        password: { label: "Password", type: "password", placeholder: "******" }
      },
      async authorize(credentials: Record<"email" | "password", string> | undefined) {
        const result = SigninInput.safeParse(credentials);
        if (!result.success) {
          return null;
        }

        const user = await prisma.user.findFirst({
          where: {
            email: result.data.email
          }
        });

        if (user) {
          const passwordValidation = await bcrypt.compare(result.data.password, user.password);
          if (passwordValidation) {
            return {
              id: user.id.toString(),
              name: user.name,
              email: user.email,
            }
          }
        }

        return null;
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
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
