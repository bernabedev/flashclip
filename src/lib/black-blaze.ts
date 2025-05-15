const BUCKET_NAME = process.env.B2_BUCKET_NAME!;
const KEY_ID = process.env.B2_APPLICATION_KEY_ID!;
const SECRET_KEY = process.env.B2_APPLICATION_KEY!;
const BASE_URL = `https://f000.backblazeb2.com/file/${BUCKET_NAME}`;

interface SignedUrlOptions {
  filePath: string;
  expiresInSeconds: number;
}

/**
 * Converts a secret key to HMAC format (Web Crypto).
 */
async function importSecretKey(secret: string): Promise<CryptoKey> {
  const enc = new TextEncoder();
  return await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-1" },
    false,
    ["sign"]
  );
}

/**
 * Signs a string with HMAC-SHA1 and returns the result in hex.
 */
async function signHmacSha1(secret: string, data: string): Promise<string> {
  const key = await importSecretKey(secret);
  const enc = new TextEncoder();
  const signature = await crypto.subtle.sign("HMAC", key, enc.encode(data));

  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Generates a signed URL for downloading a private file from Backblaze B2.
 */
export async function generateSignedUrl({
  filePath,
  expiresInSeconds,
}: SignedUrlOptions): Promise<string> {
  const expiresTimestamp = Math.floor(Date.now() / 1000) + expiresInSeconds;
  const urlToSign = `/file/${BUCKET_NAME}/${filePath}`;
  const stringToSign = `${urlToSign}${expiresTimestamp}`;

  const signature = await signHmacSha1(SECRET_KEY, stringToSign);

  const signedUrl = `${BASE_URL}/${filePath}?Authorization=${signature}&Expires=${expiresTimestamp}&KeyId=${KEY_ID}`;
  return signedUrl;
}
