import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";
import { ac, adminRole, superadminRole, userRole } from "./rbac";

export const authClient = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  plugins: [
    adminClient({
      ac,
      roles: {
        user: userRole,
        admin: adminRole,
        superadmin: superadminRole,
      },
    }),
  ],
});

export const { signIn, signUp, signOut, useSession, updateUser, admin } =
  authClient;
