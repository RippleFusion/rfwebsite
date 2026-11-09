import { NextResponse } from "next/server";
import { getShowDetails } from "@/lib/tmdb";

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const id = Number((await ctx.params).id);
  if (!Number.isInteger(id) || id <= 0) {
    return NextResponse.json({ error: "bad id" }, { status: 400 });
  }
  try {
    return NextResponse.json(await getShowDetails(id));
  } catch {
    return NextResponse.json({ error: "upstream" }, { status: 502 });
  }
}
