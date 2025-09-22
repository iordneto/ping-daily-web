/* 
    This function generates a random string of a given length.
    It uses a fixed set of characters and a random number generator to create a string of the desired length.
    It is used to generate nonce and state for the Slack OAuth flow.
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
