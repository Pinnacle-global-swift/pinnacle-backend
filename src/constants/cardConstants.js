export const CARD_REQUIREMENTS = {
    MINIMUM_BALANCE: 100,
    MINIMUM_WORKING_DAYS: 3
  };
  
  export const CARD_TYPES = {
    MASTERCARD: 'mastercard'
  };
  
  export const CARD_LIMITS = {
    [CARD_TYPES.MASTERCARD]: {
      limit: 10000,
      paymentAmount: 25
    }
  };