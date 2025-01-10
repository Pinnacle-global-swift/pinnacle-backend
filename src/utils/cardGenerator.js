import crypto from 'crypto';

// Mastercard BIN ranges (starting with 51-55 or 2221-2720)
const MASTERCARD_BINS = [
  { start: 51, end: 55 },
  { start: 2221, end: 2720 }
];

export class CardGenerator {
  static generateMastercardNumber() {
    // Choose a random BIN range
    const binRange = MASTERCARD_BINS[Math.random() < 0.5 ? 0 : 1];
    let prefix;
    
    if (binRange.start >= 2221) {
      // Generate 4-digit BIN for 2221-2720 range
      prefix = Math.floor(binRange.start + Math.random() * (binRange.end - binRange.start + 1));
    } else {
      // Generate 2-digit BIN for 51-55 range
      prefix = Math.floor(binRange.start + Math.random() * (binRange.end - binRange.start + 1));
    }

    // Convert prefix to string and pad with zeros if needed
    const prefixStr = prefix.toString();
    
    // Generate remaining digits (16 - prefix length)
    const remainingLength = 15 - prefixStr.length;
    const remainingDigits = Array.from(
      { length: remainingLength },
      () => Math.floor(Math.random() * 10)
    ).join('');

    // Combine prefix and remaining digits
    const numberWithoutChecksum = `${prefixStr}${remainingDigits}`;
    
    // Calculate and append Luhn checksum
    const checksum = this.calculateLuhnChecksum(numberWithoutChecksum);
    
    return `${numberWithoutChecksum}${checksum}`;
  }

  static calculateLuhnChecksum(number) {
    const digits = number.split('').map(Number).reverse();
    let sum = 0;
    
    for (let i = 0; i < digits.length; i++) {
      if (i % 2 === 1) {
        const doubled = digits[i] * 2;
        sum += doubled > 9 ? doubled - 9 : doubled;
      } else {
        sum += digits[i];
      }
    }

    return (10 - (sum % 10)) % 10;
  }

  static generateCardDetails() {
    const now = new Date();
    const expiryDate = new Date(now.setFullYear(now.getFullYear() + 4));
    const month = (expiryDate.getMonth() + 1).toString().padStart(2, '0');
    const year = expiryDate.getFullYear().toString().slice(-2);

    return {
      number: this.generateMastercardNumber(),
      cvv: Math.floor(100 + Math.random() * 900).toString(),
      expiryMonth: month,
      expiryYear: year,
      type: 'mastercard'
    };
  }

  static formatCardNumber(number) {
    return number.match(/.{1,4}/g).join(' ');
  }
}