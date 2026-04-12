import type { User } from "@supabase/supabase-js";

type RoleLikeObject = Record<string, unknown> | null | undefined;
type RoleClaims = RoleLikeObject;

function normalizeRole(value: unknown) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

function roleFromObject(value: unknown) {
  if (!value || typeof value !== "object") {
    return "";
  }

  return normalizeRole((value as Record<string, unknown>).role);
}

export function getRoleFromUser(user: User | null | undefined) {
  return (
    roleFromObject(user?.app_metadata) ||
    roleFromObject(user?.user_metadata)
  );
}

export function getRoleFromClaims(claims: RoleClaims) {
  return (
    roleFromObject(claims && typeof claims === "object" ? claims.app_metadata : null) ||
    roleFromObject(claims && typeof claims === "object" ? claims.user_metadata : null) ||
    normalizeRole(claims && typeof claims === "object" ? claims.role : null)
  );
}

export function isPortalUser(user: User | null | undefined, claims?: RoleClaims) {
  return getRoleFromClaims(claims) === "user" || getRoleFromUser(user) === "user";
}

export function isAdminUser(user: User | null | undefined, claims?: RoleClaims) {
  const role = getRoleFromClaims(claims) || getRoleFromUser(user);
  return Boolean(user) && role === "admin";
}
