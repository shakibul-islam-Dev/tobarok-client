import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";
import { ac, adminRole, superadminRole, userRole } from "./rbac";

export const authClient = createAuthClient({
  // NEXT_PUBLIC_URL = backend base URL in this project's env convention
  baseURL: process.env.NEXT_PUBLIC_URL || undefined,
  fetchOptions: {
    credentials: "include",
  },
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
