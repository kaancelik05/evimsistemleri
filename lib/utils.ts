import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// JWT token'ı UTF-8 uyumlu şekilde decode et
export function decodeJWT(token: string): any {
  try {
    const base64Payload = token.split('.')[1];
    const binaryString = atob(base64Payload);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return JSON.parse(new TextDecoder('utf-8').decode(bytes));
  } catch (error) {
    console.error('JWT decode error:', error);
    throw error;
  }
}
