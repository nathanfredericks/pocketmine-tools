import { NextRequest, NextResponse } from 'next/server';
import pako from 'pako';
import { cleanUnparsedCrashdump } from '../../../lib/pocketmine-utils';
export async function POST(request: NextRequest) {
  const body = await request.json();
  const crashdump = body.crashdump;
  if (!crashdump) {
    return NextResponse.json(
      { code: 'MISSING_CRASHDUMP', message: 'Missing crashdump.' },
      { status: 400 }
    );
  }
  try {
    const parsedCrashdump = parseCrashdump(crashdump);
    return NextResponse.json({
      crashdump: JSON.stringify(parsedCrashdump, null, 2),
    });
  } catch {
    return NextResponse.json(
      { code: 'PARSE_ERROR', message: 'Error parsing crashdump.' },
      { status: 400 }
    );
  }
}
function parseCrashdump(crashdump: string) {
  const cleanedCrashdump = cleanUnparsedCrashdump(crashdump);
  const decodedBase64 = atob(cleanedCrashdump);
  const bytes = new Uint8Array(decodedBase64.length);
  for (let i = 0; i < decodedBase64.length; i++) {
    bytes[i] = decodedBase64.charCodeAt(i);
  }
  const inflatedZlib = pako.inflate(bytes);
  const decodedCrashdump = new TextDecoder('utf-8').decode(inflatedZlib);
  return JSON.parse(decodedCrashdump);
}
