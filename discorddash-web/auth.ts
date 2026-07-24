import NextAuth from "next-auth"
import Discord from "next-auth/providers/discord"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Discord({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, account, profile }) {
      // Pass the Discord user ID to the token on initial sign in
      if (profile?.id) {
        token.discordId = profile.id;
      } else if (account && user) {
        token.discordId = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      // Expose the Discord user ID to the client via session
      if (token.discordId || token.sub) {
        session.user.id = (token.discordId || token.sub) as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login', // Custom login page
  },
})
