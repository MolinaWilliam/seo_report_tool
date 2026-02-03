import pako from 'pako';

/**
 * Compresses an object using gzip and encodes it as base64.
 * @param data - The object to compress
 * @returns Base64-encoded gzip compressed string
 */
export function compressData<T>(data: T): string {
  const jsonString = JSON.stringify(data);
  const compressed = pako.gzip(jsonString);
  // Convert Uint8Array to base64
  return Buffer.from(compressed).toString('base64');
}

/**
 * Decompresses a base64-encoded gzip string back to an object.
 * @param compressedString - Base64-encoded gzip compressed string
 * @returns The decompressed object
 */
export function decompressData<T>(compressedString: string): T {
  const compressed = Buffer.from(compressedString, 'base64');
  const decompressed = pako.ungzip(compressed, { to: 'string' });
  return JSON.parse(decompressed);
}

/**
 * Checks if a string is compressed (base64) or plain JSON.
 * Plain JSON starts with '{' or '[', compressed data is base64.
 * @param data - The string to check
 * @returns true if the data appears to be compressed
 */
export function isCompressed(data: string): boolean {
  const trimmed = data.trimStart();
  return !trimmed.startsWith('{') && !trimmed.startsWith('[');
}
