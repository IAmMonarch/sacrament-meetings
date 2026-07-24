import { headers } from 'next/headers';

export async function getBaseUrl(): Promise<string> {
  const headersList = await headers();
  const host = headersList.get('host');
  const protocol = host?.startsWith('localhost') || host?.startsWith('127.0.0.1')
    ? 'http'
    : 'https';
  return `${protocol}://${host}`;
}
