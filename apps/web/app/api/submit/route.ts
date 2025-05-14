import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { name, dateOfBirth, hometown, occupation } = await request.json();

  // 2. forward it to the external API
  const extRes = await fetch("https://external.api/endpoint", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // if your external API needs an API key
      Authorization: `Bearer ${process.env.EXTERNAL_API_KEY}`,
    },
    body: JSON.stringify({ name, dateOfBirth, hometown, occupation }),
  });

  const extData = await extRes.json();

  // 3. proxy error/status if needed
  if (!extRes.ok) {
    return NextResponse.json({ error: extData }, { status: extRes.status });
  }

  // 4. return the external API’s data
  return NextResponse.json({ result: extData });
}
