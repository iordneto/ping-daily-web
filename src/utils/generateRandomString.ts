/**
 * Generates a cryptographically random string of specified length
 * Uses alphanumeric characters (A-Z, a-z, 0-9) for OAuth state and nonce generation
 * @param {number} length - The desired length of the random string
 * @returns {string} A random string of the specified length
 * @example
 * generateRandomString(16) // Returns something like: "aB3dF8kL2nM9pQ7s"
 */
export const generateRandomString = (length: number) => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};
