import { Account } from '../models/Account.js';
import { ValidationError } from '../utils/errors.js';
import { isValidAccountNumber } from '../utils/accountUtils.js';

class TransferValidator {
  async validateTransfer(userId, accountNumber, amount) {
    await this.validateAccountNumber(accountNumber);
    const senderAccount = await this.validateSenderBalance(userId, amount);
    const recipientAccount = await this.validateRecipientAccount(accountNumber);
    await this.validateSelfTransfer(senderAccount, accountNumber);

    return { senderAccount, recipientAccount };
  }

  
  async validateAccountNumber(accountNumber) {
    if (!isValidAccountNumber(accountNumber)) {
      throw new ValidationError('Invalid account number format');
    }
  }

  async validateSenderBalance(userId, amount) {
    const senderAccount = await Account.findOne({ userId });
    if (!senderAccount || senderAccount.balance < amount) {
      throw new ValidationError('Insufficient balance');
    }
    return senderAccount;
  }

  async validateRecipientAccount(accountNumber) {
    const recipientAccount = await Account.findOne({ accountNumber });
    if (!recipientAccount) {
      throw new ValidationError('Recipient account not found');
    }
    return recipientAccount;
  }

  async validateSelfTransfer(senderAccount, recipientAccountNumber) {
    if (senderAccount.accountNumber === recipientAccountNumber) {
      throw new ValidationError('Cannot transfer to your own account');
    }
  }
}

export const transferValidator = new TransferValidator();