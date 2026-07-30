import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { authConfig } from './auth.config';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'bishop@example.com';
// Default bcrypt hash for 'password123'
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || '$2b$10$gJXMo8Ne8Xr22yuP.6jn6.4/hfuB6CorDNEV4BhngN2ztr8Q8pP.i';

async function getUserByEmail(email: string) {
  if (email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
    return {
      id: '1',
      email: ADMIN_EMAIL,
      name: 'Bishopric',
      passwordHash: ADMIN_PASSWORD_HASH,
    };
  }
  return null;
}

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsed = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (!parsed.success) return null;

        const { email, password } = parsed.data;
        const user = await getUserByEmail(email);
        if (!user) return null;

        const passwordsMatch = await bcrypt.compare(password, user.passwordHash);
        if (passwordsMatch) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { passwordHash, ...userWithoutPassword } = user;
          return userWithoutPassword;
        }

        return null;
      },
    }),
  ],
});
