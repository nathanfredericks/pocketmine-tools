import mcpePing from 'mcpe-ping';
export default function handler(req, res) {
  if (req.method === 'GET') {
    const host = req.query.host;
    const port = req.query.port;
    if (host && port) {
        mcpePing(host, Number.parseInt(port), function(err, resp) {
          if (err) {
            switch (err.description) {
              case 'DNS lookup failed.':
                res.status(400).json({
                  code: 'DNS_LOOKUP_FAILED',
                  message: err.description
                });
                break;
              case 'Bad packet response.':
                res.status(400).json({
                  code: 'BAD_PACKET_RESPONSE',
                  message: err.description
                });
                break;
              case 'Error sending ping.':
                res.status(400).json({
                  code: 'PING_SEND_ERROR',
                  message: err.description
                });
                break;
              case 'Ping session timed out.':
                res.status(400).json({
                  code: 'PING_TIMEOUT',
                  message: err.description
                });
                break;
              default:
                res.status(400).json({
                  code: 'UNKNOWN_ERROR',
                  message: 'An unknown error occurred.'
                });
                break;
            }
          } else {
            res.status(200).json({
              name: resp.name,
              mcpeVersion: resp.version,
              currentPlayers: Number.parseInt(resp.currentPlayers),
              maxPlayers: Number.parseInt(resp.maxPlayers)
            })
          }
        }, 3000);
      }
    } else {
      res.status(400).json({
        code: 'MISSING_QUERY',
        message: 'Missing host or port.'
      });
    }
}
