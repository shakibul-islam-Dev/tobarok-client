import { createAccessControl } from "better-auth/plugins/access";

const statements = {
  user: [
    "get",
    "list",
    "create",
    "update",
    "delete",
    "set-role",
    "set-password",
    "set-email",
    "ban",
  ],
  session: ["list", "revoke", "delete"],
} as const;

export const ac = createAccessControl(statements);

export const userRole = ac.newRole({});

export const adminRole = ac.newRole({
  user: ["get", "list", "create", "update", "ban"],
  session: ["list", "revoke", "delete"],
});

export const superadminRole = ac.newRole({
  user: [
    "get",
    "list",
    "create",
    "update",
    "delete",
    "set-role",
    "set-password",
    "set-email",
    "ban",
  ],
  session: ["list", "revoke", "delete"],
});
