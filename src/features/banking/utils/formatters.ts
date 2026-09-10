import {format, parseISO} from 'date-fns';

import {BankTransactionDirection} from '../types/bank-transaction';

export function formatBankTransactionDate(value: string | null) {
  return formatBankTransactionDateValue(value, 'MMM d, yyyy');
}

export function formatBankTransactionCompactDate(value: string | null) {
  return formatBankTransactionDateValue(value, 'd MMM');
}

function formatBankTransactionDateValue(value: string | null, pattern: string) {
  if (!value) return '—';
  const date = parseISO(value);
  return Number.isNaN(date.getTime()) ? value : format(date, pattern);
}

export function formatBankTransactionType(value: string | null) {
  if (!value) return 'Other';
  return value
    .toLowerCase()
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export function getBankTransactionDisplayDescription({
  description,
  counterpartyName,
}: {
  description: string | null;
  counterpartyName: string | null;
}) {
  const normalizedDescription = normalizeBankTransactionText(description);
  const normalizedCounterpartyName = normalizeBankTransactionText(counterpartyName);

  if (!normalizedDescription) return normalizedCounterpartyName || 'Transaction';

  const structuredCounterpartyName = extractStructuredCounterpartyName(normalizedDescription);
  if (structuredCounterpartyName) return normalizedCounterpartyName || structuredCounterpartyName;

  const cardDescription = extractCardDescription(normalizedDescription);
  if (cardDescription) return cardDescription;

  if (normalizedCounterpartyName && normalizedDescription.length > 80) {
    return normalizedCounterpartyName;
  }

  return normalizedDescription;
}

function normalizeBankTransactionText(value: string | null) {
  const normalizedValue = value?.replace(/\s+/g, ' ').trim();
  return normalizedValue || null;
}

function extractStructuredCounterpartyName(description: string) {
  const match = description.match(
    /^sepa\b.*?\bnaam:\s*(.+?)(?=\s+(?:omschrijving|kenmerk|machtiging|iban|bic):|$)/i,
  );
  return match?.[1]?.trim() || null;
}

function extractCardDescription(description: string) {
  const googlePayMarker = description.match(/^(?:bea|gea),\s*google\s+pay\s+/i);
  const cardMarker = description.match(/^(?:bea|gea),\s*/i);
  const candidate = googlePayMarker
    ? description.slice(googlePayMarker.index! + googlePayMarker[0].length)
    : cardMarker
      ? description.slice(cardMarker[0].length)
      : null;

  if (!candidate) return null;

  const merchant = candidate.match(/^(.+?)(?=\s+nr:|,\s*\d{2}[./]\d{2}[./]\d{2}\/|$)/i);
  return merchant?.[1]?.trim() || null;
}

export function formatBankingWords(value: string) {
  return value
    .toLowerCase()
    .split(/[_-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export function formatBankTransactionDirection(value: BankTransactionDirection) {
  if (value === BankTransactionDirection.INCOME) return 'Income';
  if (value === BankTransactionDirection.EXPENSE) return 'Expense';
  return 'Unknown direction';
}

export function formatBankTransactionStatus(value: string | null) {
  if (!value) return 'Unknown status';
  const normalized = value.toUpperCase();
  if (normalized === 'BOOK') return 'Booked';
  if (normalized === 'PENDING') return 'Pending';
  if (normalized === 'EXPECTED') return 'Expected';
  if (normalized === 'REJECTED') return 'Rejected';
  if (normalized === 'DELETED') return 'Removed';
  return formatBankingWords(value);
}
