import type { NextAuthConfig } from "next-auth";
import bcryptjs from "bcryptjs";

import Credentials from "next-auth/providers/credentials";
import { LoginSchema } from "./schemas";
import { getUserByEmail } from "./data/user";
import google from "next-auth/providers/google";
import github from "next-auth/providers/github";

export default {
  providers: [
    google,
    github({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    Credentials({
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials);

        if (validatedFields.success) {
          const { email, password } = validatedFields.data;

          const user = await getUserByEmail(email);

          if (!user || !user.password) return null;

          const passwordsMatch = await bcryptjs.compare(
            password,
            user.password
          );

          if (passwordsMatch) return user;
        }
        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
