import {SvelteKitAuth} from "@auth/sveltekit"
import {MongoDBAdapter} from "@auth/mongodb-adapter"
import GitHub from "@auth/core/providers/github"
import Google from "@auth/core/providers/google"
import CredentialsProvider from "@auth/core/providers/credentials"
import {GITHUB_ID, GITHUB_SECRET, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET} from "$env/static/private"
import db from '$lib/db/db';

export const handle = SvelteKitAuth({
  providers: [GitHub({clientId: GITHUB_ID, clientSecret: GITHUB_SECRET}),
    Google({clientId: GOOGLE_CLIENT_ID, clientSecret: GOOGLE_CLIENT_SECRET}),
    CredentialsProvider({
      name: "Sign in with email",
      credentials: {
        email: {label: "Email", type: "email"},
        password: {label: "Password", type: "password"}
      },
      authorize: async (credentials) => {
        const user = await db.findUserByEmail(credentials.email as string);
        if (user?.password !== credentials.password) {
          throw new Error("User not found.");
        }
        return user;
      }
    })],
  adapter: MongoDBAdapter(db.getClient(), {
    databaseName: db.getDatabaseName(),
  }),
})