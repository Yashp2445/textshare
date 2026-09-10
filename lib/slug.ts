import { randomBytes, randomInt } from 'crypto';

const SLUG_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const SLUG_LENGTH = 8;

export function generateSlug(): string {
  const chars: string[] = [];
  for (let i = 0; i < SLUG_LENGTH; i++) {
    chars.push(SLUG_CHARS[randomInt(SLUG_CHARS.length)]);
  }
  return chars.join('');
}

export function generateFileId(): string {
  return randomBytes(16).toString('hex');
}
