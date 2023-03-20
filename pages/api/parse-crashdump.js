import pako from 'pako';
import {cleanUnparsedCrashdump} from '../../lib/utils';
import schema from '../../lib/crashdump-schema.json';
import Ajv from 'ajv';
import draft6MetaSchema from 'ajv/dist/refs/json-schema-draft-06.json';
const ajv = new Ajv();
ajv.addMetaSchema(draft6MetaSchema);
export default function handler(req, res) {
  if (req.method === 'POST') {
    const crashdump = req.body.crashdump;
    if (crashdump) {
      try {
        const parsedCrashdump = parseCrashdump(crashdump);
        const valid = ajv.validate(schema, parsedCrashdump);
        res.status(200).json({
          'preview': valid,
          'crashdump': JSON.stringify(parsedCrashdump, null, 2)
        });
      } catch {
        res.status(400).json({
          code: 'PARSE_ERROR',
          message: 'Error parsing crashdump.'
        });
      }
    } else {
      res.status(400).json({
        code: 'MISSING_CRASHDUMP',
        message: 'Missing crashdump.'
      });
    }
  } else {
    res.status(405).json({
      code: 'METHOD_NOT_ALLOWED',
      message: 'Method not allowed.'
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
