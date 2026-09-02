import { NextResponse } from "next/server";

const BACKEND = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8013").replace(/\/+$/, "");

export async function GET() {
  const url = `${BACKEND}/api/v1/produits/categories`;

  let res: Response;
  try {
    res = await fetch(url, {
      signal: AbortSignal.timeout(28_000),
      next: { revalidate: 600 },
    });
  } catch {
    return NextResponse.json({ error: "upstream timeout" }, { status: 504 });
  }

  if (!res.ok) {
    return NextResponse.json({ error: "upstream error" }, { status: res.status });
  }

  const data = await res.json();

  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "public, s-maxage=600, stale-while-revalidate=1200",
    },
  });
}
