import { Webhook } from "svix";
import { headers } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
);

interface ClerkEvent {
  type: string;
  data: {
    id: string;
    email_addresses?: Array<{ email_address: string }>;
    first_name?: string | null;
    last_name?: string | null;
    image_url?: string | null;
  };
}

export async function POST(req: NextRequest) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  console.log("=== WEBHOOK RECEIVED ===");
  console.log("WEBHOOK_SECRET exists:", !!WEBHOOK_SECRET);

  if (!WEBHOOK_SECRET) {
    console.error("CLERK_WEBHOOK_SECRET is not set");
    return NextResponse.json(
      { error: "CLERK_WEBHOOK_SECRET is not set" },
      { status: 500 },
    );
  }

  // Get headers
  const headersList = await headers();
  const svix_id = headersList.get("svix-id");
  const svix_timestamp = headersList.get("svix-timestamp");
  const svix_signature = headersList.get("svix-signature");

  console.log("Svix headers present:", {
    svix_id: !!svix_id,
    svix_timestamp: !!svix_timestamp,
    svix_signature: !!svix_signature,
  });

  // If no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error("Missing Svix headers");
    return new Response("Error occurred -- no Svix headers", { status: 400 });
  }

  // Get body
  const body = await req.text();
  console.log("Body received (first 200 chars):", body.substring(0, 200));

  // Create a new Webhook instance with your secret
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: ClerkEvent;
  // Verify payload
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as ClerkEvent;
    console.log("Webhook verified successfully");
  } catch (err) {
    console.error("Error verifying webhook:", err);
    console.error(
      "Webhook verification failed - this could indicate wrong secret",
    );
    return new Response("Error occurred", { status: 400 });
  }

  const eventType = evt.type;
  console.log("Event type:", eventType);

  if (eventType === "user.created" || eventType === "user.updated") {
    const { id, email_addresses, first_name, last_name, image_url } = evt.data;

    const primaryEmail = email_addresses?.[0]?.email_address ?? "";

    console.log("Processing user:", {
      id,
      primaryEmail,
      first_name,
      last_name,
    });
    console.log("Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log(
      "Service role key exists:",
      !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    );

    try {
      console.log("Attempting to upsert user to Supabase...");
      const { error, data } = await supabase.from("users").upsert(
        {
          clerk_user_id: id,
          email: primaryEmail,
          first_name: first_name ?? null,
          last_name: last_name ?? null,
          image_url: image_url ?? null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "clerk_user_id" },
      );

      if (error) {
        console.error("Error upserting user to Supabase:", error);
        return NextResponse.json(
          { error: error.message ?? "Unknown error" },
          { status: 500 },
        );
      }

      console.log("User synced successfully to Supabase:", data);
      return NextResponse.json(
        { message: "User synced successfully" },
        { status: 200 },
      );
    } catch (err) {
      console.error("Error syncing user:", err);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 },
      );
    }
  }

  if (eventType === "user.deleted") {
    const { id } = evt.data;
    console.log("Deleting user:", { id });

    try {
      const { error } = await supabase
        .from("users")
        .delete()
        .eq("clerk_user_id", id);

      if (error) {
        console.error("Error deleting user:", error);
        return NextResponse.json(
          { error: error.message ?? "Unknown error" },
          { status: 500 },
        );
      }

      console.log("User deleted successfully");
      return NextResponse.json(
        { message: "User deleted successfully" },
        { status: 200 },
      );
    } catch (err) {
      console.error("Error deleting user:", err);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 },
      );
    }
  }

  console.log("Event type not handled:", eventType);
  return NextResponse.json({ message: "Event received" }, { status: 200 });
}
