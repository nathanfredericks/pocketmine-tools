import pako from 'pako';
import { cleanUnparsedCrashdump } from '../../lib/utils';
export default function handler(req, res) {
  if (req.method === 'POST') {
    const crashdump = req.body.crashdump;
    if (crashdump) {
      try {
        const parsedCrashdump = parseCrashdump(crashdump);
        res.status(200).json({
          crashdump: JSON.stringify(parsedCrashdump, null, 2),
        });
      } catch {
        res.status(400).json({
          code: 'PARSE_ERROR',
          message: 'Error parsing crashdump.',
        });
      }
    } else {
      res.status(400).json({
        code: 'MISSING_CRASHDUMP',
        message: 'Missing crashdump.',
      });
    }
  } else {
    res.status(405).json({
      code: 'METHOD_NOT_ALLOWED',
      message: 'Method not allowed.',
    });
  }
}
function parseCrashdump(crashdump) {
  const cleanedCrashdump = cleanUnparsedCrashdump(crashdump);
  const decodedBase64 = atob(cleanedCrashdump);
  const inflatedZlib = pako.inflate(decodedBase64);
  const decodedCrashdump = new TextDecoder('utf-8').decode(inflatedZlib);
  return JSON.parse(decodedCrashdump);
}
