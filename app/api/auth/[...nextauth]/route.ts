import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'GR8 Passport',
      credentials: {
        username: { label: 'Username', type: 'text', placeholder: 'player1' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        // TODO: Replace with real PostgreSQL check using the pg package
        if (credentials?.username === 'player' && credentials?.password === 'password') {
          return { id: '1', name: 'Player One', email: 'player@gr8gamz.com' };
        }
        return null;
      }
    })
  ],
  pages: {
    signIn: '/auth',
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.sub;
      }
      return session;
    }
  }
});

export { handler as GET, handler as POST };
