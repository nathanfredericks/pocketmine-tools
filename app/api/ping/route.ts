import { NextRequest, NextResponse } from "next/server";
import mcpePing from "mcpe-ping";

export async function GET(request: NextRequest) {
  const host = request.nextUrl.searchParams.get("host");
  const port = request.nextUrl.searchParams.get("port");

  if (!host || !port) {
    return NextResponse.json(
      { code: "MISSING_QUERY", message: "Missing host or port." },
      { status: 400 }
    );
  }
  try {
    const result = await new Promise<{
      name: string;
      version: string;
      currentPlayers: string;
      maxPlayers: string;
    }>((resolve, reject) => {
      mcpePing(
        host,
        Number.parseInt(port),
        (err: any, resp: any) => {
          if (err) reject(err);
          else resolve(resp);
        },
        3000
      );
    });

    return NextResponse.json({
      name: result.name,
      mcpeVersion: result.version,
      currentPlayers: Number.parseInt(result.currentPlayers),
      maxPlayers: Number.parseInt(result.maxPlayers),
    });
  } catch (err: any) {
    const description = err?.description;

    switch (description) {
      case "DNS lookup failed.":
        return NextResponse.json(
          { code: "DNS_LOOKUP_FAILED", message: description },
          { status: 400 }
        );
      case "Bad packet response.":
        return NextResponse.json(
          { code: "BAD_PACKET_RESPONSE", message: description },
          { status: 400 }
        );
      case "Error sending ping.":
        return NextResponse.json(
          { code: "PING_SEND_ERROR", message: description },
          { status: 400 }
        );
      case "Ping session timed out.":
        return NextResponse.json(
          { code: "PING_TIMEOUT", message: description },
          { status: 400 }
        );
      default:
        return NextResponse.json(
          { code: "UNKNOWN_ERROR", message: "An unknown error occurred." },
          { status: 400 }
        );
    }
  }
}
