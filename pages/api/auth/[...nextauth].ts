// https://next-auth.js.org/getting-started/example#add-api-route
import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import nextAuthDynamodb from "next-auth-dynamodb";

const options = {
  // Configure one or more authentication providers
  providers: [
    Providers.Twitter({
      clientId: process.env.TWITTER_ID,
      clientSecret: process.env.TWITTER_SECRET,
    }),
    // ...add more providers here
  ],

  callbacks: {
    /**
     * https://next-auth.js.org/configuration/callbacks#session-callback
     * @param  {object} session      Session object
     * @param  {object} user         User object    (if using database sessions)
     *                               JSON Web Token (if not using database sessions)
     * @return {object}              Session that will be returned to the client
     */
    session: async (session, user) => {
      // add our application's userId (not Twitter, GitHub etc) to the session object
      // we should not need it in the client often, but it is nice to know how to access it
      session.userId = user.id;
      return Promise.resolve(session);
    },
  },

  /**
   * This npm module isn't well documented yet.
   * The hard part was figuring out what DynamoDB tables + indexes this adapter assumes will exist.
   * The solution is in the schema definitions in https://github.com/tgandrews/next-auth-dynamodb/blob/main/src/index.ts
   * table `users` with primary key `id`
   * table `accounts` with primary key `accounts`, sort key `providerAccountId`
   * table `sessions` with primary key `id`
   */
  adapter: nextAuthDynamodb,

  // https://next-auth.js.org/configuration/options#debug
  debug: true,

  secret: process.env.NEXTAUTH_SECRET,
};

export default (req, res) => {
  return NextAuth(req, res, options);
};
