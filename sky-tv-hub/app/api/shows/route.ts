import { NextResponse } from "next/server";
import { getShowsByIds } from "@/lib/tmdb";

export async function GET(req: Request) {
  const raw = new URL(req.url).searchParams.get("ids") ?? "";
  const ids = raw
    .split(",")
    .map(Number)
    .filter((n) => Number.isInteger(n) && n > 0);
  if (ids.length === 0) return NextResponse.json([]);
  try {
    return NextResponse.json(await getShowsByIds(ids));
  } catch {
    return NextResponse.json([], { status: 502 });
  }
}
