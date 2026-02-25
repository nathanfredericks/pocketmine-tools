declare module 'mcpe-ping' {
  interface PingResponse {
    name: string;
    version: string;
    currentPlayers: string;
    maxPlayers: string;
  }
  function mcpePing(
    host: string,
    port: number,
    callback: (err: any, response: PingResponse) => void,
    timeout?: number
  ): void;
  export default mcpePing;
}
