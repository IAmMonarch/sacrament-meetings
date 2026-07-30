import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const { pathname } = nextUrl;

      // Define bishopric management (protected) routes
      const isManage = pathname.startsWith('/meetings/manage');
      const isNew = pathname.startsWith('/meetings/new');
      const isEdit = pathname.startsWith('/meetings/') && pathname.endsWith('/edit');

      const isProtected = isManage || isNew || isEdit;

      if (isProtected) {
        if (isLoggedIn) return true;
        return false; // Redirects to /login
      }

      // Redirect logged-in users away from the login page
      if (isLoggedIn && pathname === '/login') {
        return Response.redirect(new URL('/meetings/manage', nextUrl));
      }

      return true;
    },
  },
  providers: [], // providers are added in auth.ts
} satisfies NextAuthConfig;
