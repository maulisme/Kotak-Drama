// app/api/stream/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const bookid = searchParams.get("bookid");
  const episode = searchParams.get("episode") ?? "1";

  if (!bookid) {
    return NextResponse.json({ error: "Missing bookid" }, { status: 400 });
  }

  const upstream = `https://api-dramabox.vercel.app/api/dramabox/stream?bookid=${encodeURIComponent(
    bookid
  )}&episode=${encodeURIComponent(episode)}`;

  try {
    const r = await fetch(upstream, {
      headers: {
        accept: "application/json",
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome Safari",
      },
      cache: "no-store",
    });

    const body = await r.text();
    return new NextResponse(body, {
      status: r.status,
      headers: {
        "content-type":
          r.headers.get("content-type") ?? "application/json; charset=utf-8",
      },
    });
  } catch (e) {
    return NextResponse.json(
      { error: "Upstream fetch failed", details: String(e) },
      { status: 502 }
    );
  }
}
