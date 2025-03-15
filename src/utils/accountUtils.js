// Constants
const BANK_PREFIX = '423'; // 3-digit constant prefix for all account numbers
const ACCOUNT_LENGTH = 10; // Total length of account number

export const generateAccountNumber = () => {
  // Generate remaining 7 digits
  const remainingDigits = Math.floor(Math.random() * Math.pow(10, ACCOUNT_LENGTH - BANK_PREFIX.length))
    .toString()
    .padStart(ACCOUNT_LENGTH - BANK_PREFIX.length, '0');
    
  return `${BANK_PREFIX}${remainingDigits}`;
};


export const isValidAccountNumber = (accountNumber) => {
  if (!accountNumber) return false;
  
  // Check length
  if (accountNumber.length !== ACCOUNT_LENGTH) return false;
  
  // Check prefix
  if (!accountNumber.startsWith(BANK_PREFIX)) return false;
  
  // Check if all characters are digits
  return /^\d+$/.test(accountNumber);
};