export type Role = "user" | "admin" | "superadmin";

export const ROLES: Role[] = ["user", "admin", "superadmin"];

export const ROLE_RANK: Record<Role, number> = {
  user: 1,
  admin: 2,
  superadmin: 3,
};

export function hasRole(
  role: string | null | undefined,
  minimum: Role
): boolean {
  const rank = role ? ROLE_RANK[role as Role] : ROLE_RANK.user;
  if (!rank) return false;
  return rank >= ROLE_RANK[minimum];
}

export function isAdmin(role: string | null | undefined): boolean {
  return hasRole(role, "admin");
}

export function isSuperAdmin(role: string | null | undefined): boolean {
  return hasRole(role, "superadmin");
}

export function roleLabel(role: string | null | undefined): string {
  switch (role) {
    case "superadmin":
      return "Super Admin";
    case "admin":
      return "Admin";
    default:
      return "User";
  }
}
