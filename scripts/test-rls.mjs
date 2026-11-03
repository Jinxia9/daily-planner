import { createClient } from "@supabase/supabase-js"

try {
  process.loadEnvFile(".env.local")
} catch {
  // Environment variables can also be provided by the shell.
}

const supabaseUrl = process.env.VITE_SUPABASE_URL
const anonKey = process.env.VITE_SUPABASE_ANON_KEY
const userAEmail = process.env.RLS_TEST_EMAIL_A
const userAPassword = process.env.RLS_TEST_PASSWORD_A
const userBEmail = process.env.RLS_TEST_EMAIL_B
const userBPassword = process.env.RLS_TEST_PASSWORD_B

const missingVariables = [
  ["VITE_SUPABASE_URL", supabaseUrl],
  ["VITE_SUPABASE_ANON_KEY", anonKey],
  ["RLS_TEST_EMAIL_A", userAEmail],
  ["RLS_TEST_PASSWORD_A", userAPassword],
  ["RLS_TEST_EMAIL_B", userBEmail],
  ["RLS_TEST_PASSWORD_B", userBPassword],
]
  .filter(([, value]) => !value)
  .map(([name]) => name)

if (missingVariables.length > 0) {
  console.error(
    `Missing environment variables: ${missingVariables.join(", ")}`
  )
  process.exit(1)
}

function createTestClient() {
  return createClient(supabaseUrl, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  })
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message)
  }
}

async function signIn(client, email, password, label) {
  const { data, error } = await client.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    throw new Error(`${label} sign-in failed: ${error.message}`)
  }

  assert(data.user, `${label} sign-in returned no user`)
  return data.user
}

const clientA = createTestClient()
const clientB = createTestClient()
const suffix = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
const created = {
  categoryId: null,
  eventId: null,
  ddlId: null,
}

try {
  const userA = await signIn(
    clientA,
    userAEmail,
    userAPassword,
    "User A"
  )
  const userB = await signIn(
    clientB,
    userBEmail,
    userBPassword,
    "User B"
  )

  const { data: categoriesA, error: categoryReadError } = await clientA
    .from("categories")
    .select("id")
    .eq("user_id", userA.id)
    .limit(1)

  if (categoryReadError || !categoriesA?.[0]) {
    throw new Error(
      `User A has no category. Apply the migration first: ${categoryReadError?.message ?? "missing category"}`
    )
  }

  const categoryId = categoriesA[0].id
  const { data: categoriesB } = await clientB
    .from("categories")
    .select("id")
    .eq("user_id", userB.id)
    .limit(1)
  const { data: testCategory, error: categoryInsertError } = await clientA
    .from("categories")
    .insert({
      user_id: userA.id,
      name: `RLS Test ${suffix}`,
      color: "blue",
    })
    .select("id")
    .single()

  if (categoryInsertError || !testCategory) {
    throw new Error(
      `User A category insert failed: ${categoryInsertError?.message}`
    )
  }
  created.categoryId = testCategory.id

  const { data: categoryVisibleToB } = await clientB
    .from("categories")
    .select("id")
    .eq("id", created.categoryId)
  assert(
    categoryVisibleToB.length === 0,
    "User B can read User A's category"
  )

  const { data: categoryChangedByB } = await clientB
    .from("categories")
    .update({ name: "stolen" })
    .eq("id", created.categoryId)
    .select("id")
  assert(
    categoryChangedByB.length === 0,
    "User B can update User A's category"
  )

  const { data: categoryDeletedByB } = await clientB
    .from("categories")
    .delete()
    .eq("id", created.categoryId)
    .select("id")
  assert(
    categoryDeletedByB.length === 0,
    "User B can delete User A's category"
  )

  const { error: forgedOwnerError } = await clientB
    .from("categories")
    .insert({
      user_id: userA.id,
      name: `Forged ${suffix}`,
      color: "red",
    })
  assert(Boolean(forgedOwnerError), "User B can insert as User A")

  const { data: testEvent, error: eventInsertError } = await clientA
    .from("events")
    .insert({
      user_id: userA.id,
      title: `RLS Event ${suffix}`,
      date: new Date().toISOString().slice(0, 10),
      category_id: categoryId,
      description: "Temporary RLS test row",
    })
    .select("id")
    .single()

  if (eventInsertError || !testEvent) {
    throw new Error(
      `User A event insert failed: ${eventInsertError?.message}`
    )
  }
  created.eventId = testEvent.id

  const { data: eventVisibleToB } = await clientB
    .from("events")
    .select("id")
    .eq("id", created.eventId)
  assert(eventVisibleToB.length === 0, "User B can read User A's event")

  const { data: eventChangedByB } = await clientB
    .from("events")
    .update({ title: "stolen" })
    .eq("id", created.eventId)
    .select("id")
  assert(eventChangedByB.length === 0, "User B can update User A's event")

  const { error: crossCategoryError } = await clientB
    .from("events")
    .insert({
      user_id: userB.id,
      title: `Cross-category ${suffix}`,
      date: new Date().toISOString().slice(0, 10),
      category_id: created.categoryId,
    })
  assert(
    Boolean(crossCategoryError),
    "User B can reference User A's category"
  )

  if (categoriesB?.[0]) {
    const { error: forgedEventOwnerError } = await clientB
      .from("events")
      .insert({
        user_id: userA.id,
        title: `Forged Event ${suffix}`,
        date: new Date().toISOString().slice(0, 10),
        category_id: categoriesB[0].id,
      })
    assert(
      Boolean(forgedEventOwnerError),
      "User B can insert an event as User A"
    )
  }

  const { data: testDDL, error: ddlInsertError } = await clientA
    .from("ddls")
    .insert({
      user_id: userA.id,
      title: `RLS DDL ${suffix}`,
      deadline: new Date().toISOString().slice(0, 10),
      progress: 10,
    })
    .select("id")
    .single()

  if (ddlInsertError || !testDDL) {
    throw new Error(
      `User A DDL insert failed: ${ddlInsertError?.message}`
    )
  }
  created.ddlId = testDDL.id

  const { data: ddlVisibleToB } = await clientB
    .from("ddls")
    .select("id")
    .eq("id", created.ddlId)
  assert(ddlVisibleToB.length === 0, "User B can read User A's DDL")

  const { data: ddlChangedByB } = await clientB
    .from("ddls")
    .update({ progress: 99 })
    .eq("id", created.ddlId)
    .select("id")
  assert(ddlChangedByB.length === 0, "User B can update User A's DDL")

  const { data: ddlDeletedByB } = await clientB
    .from("ddls")
    .delete()
    .eq("id", created.ddlId)
    .select("id")
  assert(ddlDeletedByB.length === 0, "User B can delete User A's DDL")

  const { error: forgedDDLOwnerError } = await clientB
    .from("ddls")
    .insert({
      user_id: userA.id,
      title: `Forged DDL ${suffix}`,
      deadline: new Date().toISOString().slice(0, 10),
      progress: 0,
    })
  assert(Boolean(forgedDDLOwnerError), "User B can insert a DDL as User A")

  const { data: eventDeletedByB } = await clientB
    .from("events")
    .delete()
    .eq("id", created.eventId)
    .select("id")
  assert(eventDeletedByB.length === 0, "User B can delete User A's event")

  console.log("RLS isolation checks passed for categories, events, and DDLs.")
} finally {
  if (created.eventId) {
    await clientA.from("events").delete().eq("id", created.eventId)
  }
  if (created.ddlId) {
    await clientA.from("ddls").delete().eq("id", created.ddlId)
  }
  if (created.categoryId) {
    await clientA.from("categories").delete().eq("id", created.categoryId)
  }
  await clientA.auth.signOut()
  await clientB.auth.signOut()
}
