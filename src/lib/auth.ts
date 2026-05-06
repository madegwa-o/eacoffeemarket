import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { z } from "zod";
import { connectDB } from "./mongodb";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";

const credentialsSchema = z.object({ username: z.string().min(3), password: z.string().min(8) });

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      credentials: { username: {}, password: {} },
      authorize: async (credentials) => {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) return null;
        await connectDB();
        const user = await User.findOne({ username: parsed.data.username });
        if (!user?.password_hash) return null;
        const valid = await bcrypt.compare(parsed.data.password, user.password_hash);
        if (!valid) return null;
        return { id: String(user._id), name: user.username, email: user.email, role: user.role };
      },
    }),
    Google({ clientId: process.env.GOOGLE_CLIENT_ID ?? "", clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "" }),
  ],
  callbacks: {
    async jwt({ token, user, account, profile }) {
      await connectDB();
      if (user) token.role = (user as { role?: string }).role;
      if (account?.provider === "google" && profile?.email) {
        let dbUser = await User.findOne({ email: profile.email });
        if (!dbUser) {
          dbUser = await User.create({ username: profile.email.split("@")[0], email: profile.email, google_id: account.providerAccountId, role: "buyer" });
        } else if (!dbUser.google_id) {
          dbUser.google_id = account.providerAccountId;
          await dbUser.save();
        }
        token.sub = String(dbUser._id);
        token.role = dbUser.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.sub as string;
      session.user.role = token.role as string;
      return session;
    },
  },
});
