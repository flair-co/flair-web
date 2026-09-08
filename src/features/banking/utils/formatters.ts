import {format, parseISO} from 'date-fns';

import {BankTransactionDirection} from '../types/bank-transaction';

export function formatBankTransactionDate(value: string | null) {
  if (!value) return '—';
  const date = parseISO(value);
  return Number.isNaN(date.getTime()) ? value : format(date, 'MMM d, yyyy');
}

export function formatBankTransactionCompactDate(value: string | null) {
  if (!value) return '—';
  const date = parseISO(value);
  return Number.isNaN(date.getTime()) ? value : format(date, 'd MMM');
}

export function formatBankTransactionType(value: string | null) {
  if (!value) return 'Other';
  return value
    .toLowerCase()
    .split('_')
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
  return value
    .toLowerCase()
    .split(/[_-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}
