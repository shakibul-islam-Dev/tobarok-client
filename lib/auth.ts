import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { admin } from "better-auth/plugins";
import {
  ac,
  adminRole,
  superadminRole,
  userRole,
} from "./rbac";

const uri =
  process.env.MONGO_DB_URI ?? "mongodb://localhost:27017/database";
const client = new MongoClient(uri);
const db = client.db("Tobarok");

export const auth = betterAuth({
  database: mongodbAdapter(db, { client }),
  emailAndPassword: {
    enabled: true,
  },
  baseURL: process.env.BETTER_AUTH_URL,
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  plugins: [
    admin({
      defaultRole: "user",
      adminRoles: ["admin", "superadmin"],
      adminUserIds:
        process.env.SUPER_ADMIN_USER_IDS?.split(",")
          .map((id) => id.trim())
          .filter(Boolean),
      ac,
      roles: {
        user: userRole,
        admin: adminRole,
        superadmin: superadminRole,
      },
    }),
  ],
});
