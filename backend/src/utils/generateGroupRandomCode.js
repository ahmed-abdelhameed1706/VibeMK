export const generateGroupRandomCode = (len) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from({ length: len }, () =>
    characters.charAt(Math.floor(Math.random() * characters.length))
  ).join("");
};
