import type { User } from "@supabase/supabase-js";

import { supabase } from "@/lib/supabase";

export type AuthProfile = {
  id: string;
  username: string | null;
  fullName: string | null;
  status: string;
};

export type UserRole = {
  name: string;
  title: string;
  secretariatId: string | null;
};

export type UserPermission = {
  name: string;
  title: string;
};

export type CurrentUser = {
  user: User;
  profile: AuthProfile | null;
  roles: UserRole[];
  permissions: UserPermission[];
};

type ProfileRow = {
  id: string;
  username: string | null;
  full_name: string | null;
  status: string;
};

type UserRoleRow = {
  secretariat_id: string | null;
  roles:
    | {
        name: string;
        title: string;
      }
    | {
        name: string;
        title: string;
      }[]
    | null;
};

type DirectPermissionRow = {
  permissions:
    | {
        name: string;
        title: string;
      }
    | {
        name: string;
        title: string;
      }[]
    | null;
};

type RolePermissionRow = {
  roles:
    | {
        role_permissions:
          | {
              permissions:
                | {
                    name: string;
                    title: string;
                  }
                | {
                    name: string;
                    title: string;
                  }[]
                | null;
            }[]
          | null;
      }
    | {
        role_permissions:
          | {
              permissions:
                | {
                    name: string;
                    title: string;
                  }
                | {
                    name: string;
                    title: string;
                  }[]
                | null;
            }[]
          | null;
      }[]
    | null;
};

function firstRelation<T>(value: T | T[] | null): T | null {
  if (!value) {
    return null;
  }

  if (Array.isArray(value)) {
    return value[0] ?? null;
  }

  return value;
}

export async function signIn(
  email: string,
  password: string,
) {
  const { data, error } =
    await supabase.auth.signInWithPassword({
      email,
      password,
    });

  if (error) {
    throw error;
  }

  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw error;
  }
}

export async function getAuthUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    return null;
  }

  return user;
}

export async function getProfile(
  userId: string,
): Promise<AuthProfile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select(`
      id,
      username,
      full_name,
      status
    `)
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    return null;
  }

  const row = data as ProfileRow;

  return {
    id: row.id,
    username: row.username,
    fullName: row.full_name,
    status: row.status,
  };
}

export async function getUserRoles(
  userId: string,
): Promise<UserRole[]> {
  const { data, error } = await supabase
    .from("user_roles")
    .select(`
      secretariat_id,
      roles (
        name,
        title
      )
    `)
    .eq("user_id", userId)
    .eq("is_active", true);

  if (error) {
    throw error;
  }

  return (data ?? [])
    .map((item) => {
      const row = item as UserRoleRow;
      const role = firstRelation(row.roles);

      if (!role) {
        return null;
      }

      return {
        name: role.name,
        title: role.title,
        secretariatId: row.secretariat_id,
      };
    })
    .filter((role): role is UserRole => role !== null);
}

export async function getUserPermissions(
  userId: string,
): Promise<UserPermission[]> {
  const permissions = new Map<
    string,
    UserPermission
  >();

  const {
    data: directPermissions,
    error: directError,
  } = await supabase
    .from("user_permissions")
    .select(`
      permissions (
        name,
        title
      )
    `)
    .eq("user_id", userId)
    .eq("is_active", true);

  if (directError) {
    throw directError;
  }

  for (const item of directPermissions ?? []) {
    const row = item as DirectPermissionRow;
    const permission = firstRelation(row.permissions);

    if (permission) {
      permissions.set(permission.name, permission);
    }
  }

  const {
    data: rolePermissions,
    error: roleError,
  } = await supabase
    .from("user_roles")
    .select(`
      roles (
        role_permissions (
          permissions (
            name,
            title
          )
        )
      )
    `)
    .eq("user_id", userId)
    .eq("is_active", true);

  if (roleError) {
    throw roleError;
  }

  for (const item of rolePermissions ?? []) {
    const row = item as RolePermissionRow;

    const role = firstRelation(row.roles);

    if (!role?.role_permissions) {
      continue;
    }

    for (const rolePermission of role.role_permissions) {
      const permission = firstRelation(
        rolePermission.permissions,
      );

      if (permission) {
        permissions.set(permission.name, permission);
      }
    }
  }

  return Array.from(permissions.values());
}

export async function getCurrentUser(): Promise<
  CurrentUser | null
> {
  const user = await getAuthUser();

  if (!user) {
    return null;
  }

  const [profile, roles, permissions] =
    await Promise.all([
      getProfile(user.id),
      getUserRoles(user.id),
      getUserPermissions(user.id),
    ]);

  return {
    user,
    profile,
    roles,
    permissions,
  };
}

export async function hasPermission(
  permission: string,
): Promise<boolean> {
  const { data, error } = await supabase.rpc(
    "has_permission",
    {
      required_permission: permission,
    },
  );

  if (error) {
    throw error;
  }

  return data === true;
}