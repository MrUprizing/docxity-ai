import jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";

/**
 * Gets the JWT secret from environment variables or throws if not set.
 * @returns The JWT secret.
 */
function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error(
      "JWT secret is not set. Please define JWT_SECRET in your environment variables.",
    );
  }
  return secret;
}

/**
 * Signs a payload and returns a JWT string using the environment secret.
 * @param payload - The payload to encode in the JWT.
 * @param options - Optional JWT signing options.
 * @returns The signed JWT as a string.
 */
export function signJwt<T extends object>(
  payload: T,
  options?: SignOptions,
): string {
  // Signs the payload and returns the JWT
  return jwt.sign(payload, getJwtSecret(), options);
}

/**
 * Verifies a JWT and returns the decoded payload using the environment secret.
 * Throws an error if the token is invalid or expired.
 * @param token - The JWT string to verify.
 * @returns The decoded payload as an object.
 */
export function verifyJwt<T extends object>(token: string): T {
  // Verifies the JWT and returns the decoded payload
  return jwt.verify(token, getJwtSecret()) as T;
}
