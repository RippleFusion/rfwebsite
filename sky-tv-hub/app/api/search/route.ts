import { NextResponse } from "next/server";
import { searchShows } from "@/lib/tmdb";

export async function GET(req: Request) {
  const q = new URL(req.url).searchParams.get("q")?.trim().slice(0, 100) ?? "";
  if (q.length < 2) return NextResponse.json([]);
  try {
    return NextResponse.json(await searchShows(q));
  } catch {
    return NextResponse.json([], { status: 502 });
  }
}
