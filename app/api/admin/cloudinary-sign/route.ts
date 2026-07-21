import { NextResponse } from "next/server";
import { createAuthedServerClient } from "@/lib/supabase/authServer";
import { signCloudinaryParams } from "@/lib/cloudinary";

export async function POST() {
  const supabase = createAuthedServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const timestamp = Math.round(Date.now() / 1000);
  const folder = "sokobase-listings";

  const signature = signCloudinaryParams({ folder, timestamp });

  return NextResponse.json({
    signature,
    timestamp,
    folder,
    apiKey: process.env.CLOUDINARY_API_KEY,
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  });
}
