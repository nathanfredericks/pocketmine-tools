// Copied from https://stackoverflow.com/questions/36098913/convert-seconds-to-days-hours-minutes-and-seconds with modifications
export function secondsToDHMS(seconds: number) {
  seconds = Number(seconds);
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const dDisplay = d > 0 ? d + (d === 1 ? ' day, ' : ' days, ') : '';
  const hDisplay = h > 0 ? h + (h === 1 ? ' hour, ' : ' hours, ') : '';
  const mDisplay = m > 0 ? m + (m === 1 ? ' minute, ' : ' minutes, ') : '';
  const sDisplay = s > 0 ? s + (s === 1 ? ' second' : ' seconds') : '';
  return dDisplay + hDisplay + mDisplay + sDisplay;
}
export function parseCode(code: {[key: number]: string }) {
  const dataArray = [];
  for (const key in code) {
    dataArray.push(code[key]);
  }
  return dataArray.join('\n');
}
export function formatOS(os: string): string {
  switch (os) {
    case 'win':
      return 'Windows';
    case 'mac':
      return 'macOS';
    case 'ios':
      return 'iOS';
    case 'android':
      return 'Android';
    case 'linux':
      return 'Linux';
    case 'bsd':
      return 'BSD';
    case 'other':
      return 'Unknown';
    default:
      return 'Unknown';
  }
}
export function cleanUnparsedCrashdump(crashdump: string): string {
  return crashdump.replace('----------------------REPORT THE DATA BELOW THIS LINE-----------------------', '')
                  .replace('===BEGIN CRASH DUMP===', '')
                  .replace('===END CRASH DUMP===', '');
}
export function capitalize(s: string) {
  return s && s[0].toUpperCase() + s.slice(1);
}
export function correctNamespacePart(part: string): string {
  // Check if first character is a number, if yes replace it with an underscore
  // @ts-ignore
  if (!isNaN(part.charAt(0))) {
    part = '_' + part;
  }
  return part.replace('-', '_')
}
