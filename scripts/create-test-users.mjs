import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error(
    "❌ SUPABASE_URL یا SUPABASE_SERVICE_ROLE_KEY تنظیم نشده است.",
  );
  process.exit(1);
}

const supabase = createClient(
  supabaseUrl,
  serviceRoleKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
);

const ALL_PERMISSIONS = [
  "news.create",
  "news.edit_own",
  "news.edit_any",
  "news.review",
  "news.publish",
  "news.delete",
  "roles.manage",
  "permissions.manage",
];

const BASIC_NEWS_PERMISSIONS = [
  "news.create",
  "news.edit_own",
];

const users = [
  {
    fullName: "SADRA",
    username: "sadra",
    email: "deputy.leader@example.com",
    password: "NigpTest01!",
    legacyRole: "secretariat_secretary",

    roles: [
      {
        name: "deputy_leader",
        secretariat: null,
      },
      {
        name: "secretariat_head",
        secretariat: "politics",
      },
    ],

    membership: {
      secretariat: "politics",
      position: "دبیر سیاسی و جامعه شناسی",
    },

    permissions: ALL_PERMISSIONS,
  },

  {
    fullName: "ASEF",
    username: "asef",
    email: "executive.deputy@example.com",
    password: "NigpTest02!",
    legacyRole: "member",

    roles: [
      {
        name: "executive_deputy",
        secretariat: null,
      },
    ],

    membership: null,
    permissions: ALL_PERMISSIONS,
  },

  {
    fullName: "SHAYAN",
    username: "shayan",
    email: "staff.shayan@example.com",
    password: "NigpTest03!",
    legacyRole: "member",

    roles: [
      {
        name: "staff",
        secretariat: null,
      },
    ],

    membership: null,
    permissions: ALL_PERMISSIONS,
  },

  {
    fullName: "ژولیده مو",
    username: "jolideh",
    email: "staff.jolideh@example.com",
    password: "NigpTest04!",
    legacyRole: "member",

    roles: [
      {
        name: "staff",
        secretariat: null,
      },
    ],

    membership: null,
    permissions: ALL_PERMISSIONS,
  },

  {
    fullName: "SPOOKY",
    username: "spooky",
    email: "militarism.head@example.com",
    password: "NigpTest05!",
    legacyRole: "secretariat_secretary",

    roles: [
      {
        name: "secretariat_head",
        secretariat: "militarism",
      },
    ],

    membership: {
      secretariat: "militarism",
      position: "دبیر دبیرخانه میلیتاریسم",
    },

    permissions: BASIC_NEWS_PERMISSIONS,
  },

  {
    fullName: "ستوش",
    username: "setoush",
    email: "culture.head@example.com",
    password: "NigpTest06!",
    legacyRole: "secretariat_secretary",

    roles: [
      {
        name: "secretariat_head",
        secretariat: "literature",
      },
    ],

    membership: {
      secretariat: "literature",
      position: "دبیر ادبیات و فرهنگ",
    },

    permissions: BASIC_NEWS_PERMISSIONS,
  },

  {
    fullName: "A.R",
    username: "ar",
    email: "history.head@example.com",
    password: "NigpTest07!",
    legacyRole: "secretariat_secretary",

    roles: [
      {
        name: "secretariat_head",
        secretariat: "history",
      },
    ],

    membership: {
      secretariat: "history",
      position: "دبیر تاریخ",
    },

    permissions: BASIC_NEWS_PERMISSIONS,
  },

  {
    fullName: "𝑉𝐶. 𝐻𝑜𝑠𝘩𝑖𝑛𝑎",
    username: "vc_hoshina",
    email: "philosophy.head@example.com",
    password: "NigpTest08!",
    legacyRole: "secretariat_secretary",

    roles: [
      {
        name: "secretariat_head",
        secretariat: "philosophy",
      },
    ],

    membership: {
      secretariat: "philosophy",
      position: "دبیر فلسفه",
    },

    permissions: BASIC_NEWS_PERMISSIONS,
  },

  {
    fullName: "Tondro",
    username: "tondro",
    email: "news.deputy@example.com",
    password: "NigpTest09!",
    legacyRole: "secretariat_member",

    roles: [
      {
        name: "secretariat_deputy",
        secretariat: "news",
      },
    ],

    membership: {
      secretariat: "news",
      position: "معاون اخبار",
    },

    permissions: BASIC_NEWS_PERMISSIONS,
  },

  {
    fullName: "faezeh121🪽",
    username: "faezeh121",
    email: "culture.deputy@example.com",
    password: "NigpTest10!",
    legacyRole: "secretariat_member",

    roles: [
      {
        name: "secretariat_deputy",
        secretariat: "literature",
      },
    ],

    membership: {
      secretariat: "literature",
      position: "معاون فرهنگ",
    },

    permissions: BASIC_NEWS_PERMISSIONS,
  },

  {
    fullName: "ϟϟGELBϟϟ",
    username: "gelb",
    email: "militarism.deputy@example.com",
    password: "NigpTest11!",
    legacyRole: "secretariat_member",

    roles: [
      {
        name: "secretariat_deputy",
        secretariat: "militarism",
      },
    ],

    membership: {
      secretariat: "militarism",
      position: "معاون میلیتاریسم",
    },

    permissions: BASIC_NEWS_PERMISSIONS,
  },

  {
    fullName: "Sorero",
    username: "sorero",
    email: "sociology.deputy@example.com",
    password: "NigpTest12!",
    legacyRole: "secretariat_member",

    roles: [
      {
        name: "secretariat_deputy",
        secretariat: "politics",
      },
    ],

    membership: {
      secretariat: "politics",
      position: "معاون جامعه شناسی",
    },

    permissions: BASIC_NEWS_PERMISSIONS,
  },

  {
    fullName: "عَبـدالمَجـید",
    username: "abdolmajid",
    email: "politics.deputy@example.com",
    password: "NigpTest13!",
    legacyRole: "secretariat_member",

    roles: [
      {
        name: "secretariat_deputy",
        secretariat: "politics",
      },
    ],

    membership: {
      secretariat: "politics",
      position: "معاون سیاسی",
    },

    permissions: BASIC_NEWS_PERMISSIONS,
  },

  {
    fullName: "𝑪𝒊𝒅 𝑲𝒂𝒈𝒆𝒏𝒐𝒖",
    username: "cid_kagenou",
    email: "history.deputy@example.com",
    password: "NigpTest14!",
    legacyRole: "secretariat_member",

    roles: [
      {
        name: "secretariat_deputy",
        secretariat: "history",
      },
    ],

    membership: {
      secretariat: "history",
      position: "معاون تاریخ",
    },

    permissions: BASIC_NEWS_PERMISSIONS,
  },
];

async function loadReferenceData() {
  const [
    rolesResult,
    permissionsResult,
    secretariatsResult,
  ] = await Promise.all([
    supabase
      .from("roles")
      .select("id,name")
      .eq("is_active", true),

    supabase
      .from("permissions")
      .select("id,name"),

    supabase
      .from("secretariats")
      .select("id,name,slug")
      .eq("is_active", true),
  ]);

  if (rolesResult.error) {
    throw rolesResult.error;
  }

  if (permissionsResult.error) {
    throw permissionsResult.error;
  }

  if (secretariatsResult.error) {
    throw secretariatsResult.error;
  }

  return {
    roles: new Map(
      rolesResult.data.map((item) => [
        item.name,
        item,
      ]),
    ),

    permissions: new Map(
      permissionsResult.data.map((item) => [
        item.name,
        item,
      ]),
    ),

    secretariats: new Map(
      secretariatsResult.data.map((item) => [
        item.slug,
        item,
      ]),
    ),
  };
}

async function findAuthUserByEmail(email) {
  let page = 1;
  const perPage = 100;

  while (true) {
    const {
      data,
      error,
    } =
      await supabase.auth.admin.listUsers({
        page,
        perPage,
      });

    if (error) {
      throw error;
    }

    const found = data.users.find(
      (user) =>
        user.email?.toLowerCase() ===
        email.toLowerCase(),
    );

    if (found) {
      return found;
    }

    if (data.users.length < perPage) {
      return null;
    }

    page += 1;
  }
}

async function ensureAuthUser(config) {
  const existing =
    await findAuthUserByEmail(config.email);

  if (existing) {
    const {
      data,
      error,
    } =
      await supabase.auth.admin.updateUserById(
        existing.id,
        {
          password: config.password,
          email_confirm: true,
          user_metadata: {
            full_name: config.fullName,
          },
        },
      );

    if (error) {
      throw error;
    }

    return {
      user: data.user,
      created: false,
    };
  }

  const {
    data,
    error,
  } = await supabase.auth.admin.createUser({
    email: config.email,
    password: config.password,
    email_confirm: true,
    user_metadata: {
      full_name: config.fullName,
    },
  });

  if (error) {
    throw error;
  }

  return {
    user: data.user,
    created: true,
  };
}

async function configureProfile(
  userId,
  config,
) {
  // handle_new_user هنگام ساخت Auth،
  // پروفایل pending ایجاد می‌کند.
  // اینجا با service-role آن را فعال می‌کنیم.
  const {
    error,
  } = await supabase
    .from("profiles")
    .update({
      full_name: config.fullName,
      username: config.username,
      status: "active",
      role: config.legacyRole,
      is_public: true,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId);

  if (error) {
    throw error;
  }
}

async function configureRoles(
  userId,
  config,
  reference,
) {
  // فقط Roleهای همین کاربران تستی را reset می‌کنیم.
  const {
    error: deleteError,
  } = await supabase
    .from("user_roles")
    .delete()
    .eq("user_id", userId);

  if (deleteError) {
    throw deleteError;
  }

  for (const roleConfig of config.roles) {
    const role =
      reference.roles.get(roleConfig.name);

    if (!role) {
      throw new Error(
        `Role not found: ${roleConfig.name}`,
      );
    }

    let secretariatId = null;

    if (roleConfig.secretariat) {
      const secretariat =
        reference.secretariats.get(
          roleConfig.secretariat,
        );

      if (!secretariat) {
        throw new Error(
          `Secretariat not found: ${roleConfig.secretariat}`,
        );
      }

      secretariatId = secretariat.id;
    }

    const {
      error,
    } = await supabase
      .from("user_roles")
      .insert({
        user_id: userId,
        role_id: role.id,
        secretariat_id: secretariatId,
        is_active: true,
      });

    if (error) {
      throw error;
    }
  }
}

async function configureMembership(
  userId,
  config,
  reference,
) {
  const {
    error: deleteError,
  } = await supabase
    .from("secretariat_members")
    .delete()
    .eq("user_id", userId);

  if (deleteError) {
    throw deleteError;
  }

  if (!config.membership) {
    return;
  }

  const secretariat =
    reference.secretariats.get(
      config.membership.secretariat,
    );

  if (!secretariat) {
    throw new Error(
      `Secretariat not found: ${config.membership.secretariat}`,
    );
  }

  const {
    error,
  } = await supabase
    .from("secretariat_members")
    .insert({
      user_id: userId,
      secretariat_id: secretariat.id,
      position: config.membership.position,
      is_active: true,
    });

  if (error) {
    throw error;
  }
}

async function configurePermissions(
  userId,
  config,
  reference,
) {
  // Permissionهای مستقیم قبلی این حساب را reset می‌کنیم.
  const {
    error: deleteError,
  } = await supabase
    .from("user_permissions")
    .delete()
    .eq("user_id", userId);

  if (deleteError) {
    throw deleteError;
  }

  if (!config.permissions.length) {
    return;
  }

  const rows = config.permissions.map(
    (permissionName) => {
      const permission =
        reference.permissions.get(
          permissionName,
        );

      if (!permission) {
        throw new Error(
          `Permission not found: ${permissionName}`,
        );
      }

      return {
        user_id: userId,
        permission_id: permission.id,
        is_active: true,
      };
    },
  );

  const {
    error,
  } = await supabase
    .from("user_permissions")
    .insert(rows);

  if (error) {
    throw error;
  }
}

async function provisionUser(
  config,
  reference,
) {
  console.log(
    `\n▶ ${config.fullName} (${config.email})`,
  );

  const {
    user,
    created,
  } = await ensureAuthUser(config);

  console.log(
    created
      ? "  ✓ Auth account created"
      : "  ✓ Existing Auth account found",
  );

  await configureProfile(
    user.id,
    config,
  );
  console.log("  ✓ Profile active");

  await configureRoles(
    user.id,
    config,
    reference,
  );
  console.log("  ✓ Roles configured");

  await configureMembership(
    user.id,
    config,
    reference,
  );
  console.log(
    "  ✓ Secretariat membership configured",
  );

  await configurePermissions(
    user.id,
    config,
    reference,
  );
  console.log(
    `  ✓ ${config.permissions.length} direct permissions configured`,
  );

  console.log(`  ✓ UUID: ${user.id}`);

  return {
    name: config.fullName,
    email: config.email,
    id: user.id,
    success: true,
  };
}

async function main() {
  console.log(
    "======================================",
  );
  console.log(
    " NIGP BULK USER PROVISIONING",
  );
  console.log(
    "======================================",
  );

  const reference =
    await loadReferenceData();

  const results = [];

  for (const config of users) {
    try {
      const result =
        await provisionUser(
          config,
          reference,
        );

      results.push(result);
    } catch (error) {
      console.error(
        `  ✗ FAILED: ${
          error?.message ?? error
        }`,
      );

      results.push({
        name: config.fullName,
        email: config.email,
        success: false,
        error:
          error?.message ?? String(error),
      });
    }
  }

  console.log(
    "\n======================================",
  );
  console.log(" SUMMARY");
  console.log(
    "======================================",
  );

  const successful =
    results.filter((item) => item.success);

  const failed =
    results.filter((item) => !item.success);

  console.log(
    `✓ Successful: ${successful.length}`,
  );

  console.log(
    `✗ Failed: ${failed.length}`,
  );

  if (failed.length) {
    console.log("\nFailed accounts:");

    for (const item of failed) {
      console.log(
        `- ${item.name}: ${item.error}`,
      );
    }

    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(
    "\nFatal error:",
    error,
  );

  process.exit(1);
});
