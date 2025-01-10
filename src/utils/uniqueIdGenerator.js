const BASE_PREFIX = '12345';

export const generateUniqueId = () => {
  // Generate 5 random digits
  const randomDigits = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
  return `${BASE_PREFIX}${randomDigits}`;
};