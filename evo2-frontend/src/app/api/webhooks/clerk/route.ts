/* eslint-disable @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access */
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

  if (!WEBHOOK_SECRET) {
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

  // If no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occurred -- no Svix headers", { status: 400 });
  }

  // Get body
  const body = await req.text();

  // Create a new Webhook instance with your secret
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: ClerkEvent;
  // Verify payload
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as unknown as ClerkEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occurred", { status: 400 });
  }

  const eventType = evt.type;

  if (eventType === "user.created" || eventType === "user.updated") {
    const { id, email_addresses, first_name, last_name, image_url } = evt.data;

    const primaryEmail = email_addresses?.[0]?.email_address ?? "";

    try {
      const { error } = await supabase.from("users").upsert(
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
        console.error("Error upserting user:", error);
        return NextResponse.json(
          { error: error.message ?? "Unknown error" },
          { status: 500 },
        );
      }

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

  return NextResponse.json({ message: "Webhook received" }, { status: 200 });
}
