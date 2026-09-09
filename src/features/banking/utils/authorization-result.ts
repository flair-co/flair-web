export type BankConnectionResult = 'connected' | 'cancelled' | 'error';

export const BANK_CONNECTION_RESULT_CHANNEL = 'tempo-bank-connection-result';

const BANK_CONNECTION_RESULT_MESSAGE = 'bank-connection-result';

type BankConnectionResultMessage = {
  type: typeof BANK_CONNECTION_RESULT_MESSAGE;
  result: BankConnectionResult;
};

export const createBankConnectionResultMessage = (
  result: BankConnectionResult,
): BankConnectionResultMessage => ({
  type: BANK_CONNECTION_RESULT_MESSAGE,
  result,
});

export const isBankConnectionResultMessage = (
  value: unknown,
): value is BankConnectionResultMessage => {
  if (typeof value !== 'object' || value === null) return false;

  const message = value as Partial<BankConnectionResultMessage>;
  return (
    message.type === BANK_CONNECTION_RESULT_MESSAGE &&
    (message.result === 'connected' || message.result === 'cancelled' || message.result === 'error')
  );
};
