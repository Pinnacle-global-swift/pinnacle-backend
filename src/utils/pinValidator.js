export const validatePIN = (pin) => {
    // Must be exactly 6 digits
    return /^\d{6}$/.test(pin);
  };
  
  