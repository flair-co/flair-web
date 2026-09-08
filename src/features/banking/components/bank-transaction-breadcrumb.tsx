import {Link} from '@tanstack/react-router';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

import {BankTransaction} from '../types/bank-transaction';

type BankTransactionBreadcrumbProps = {
  transaction?: BankTransaction;
};

export function BankTransactionBreadcrumb({transaction}: BankTransactionBreadcrumbProps) {
  const label = transaction?.description || transaction?.counterpartyName || 'Transaction';

  return (
    <Breadcrumb>
      <BreadcrumbList className='max-md:flex-nowrap max-md:overflow-hidden'>
        <BreadcrumbItem className='max-md:shrink-0'>
          <BreadcrumbLink asChild>
            <Link to='/'>Home</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem className='max-md:shrink-0'>
          {transaction ? (
            <BreadcrumbLink asChild>
              <Link to='/bank-transactions'>Bank Transactions</Link>
            </BreadcrumbLink>
          ) : (
            <BreadcrumbPage>Bank Transactions</BreadcrumbPage>
          )}
        </BreadcrumbItem>
        {transaction && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem className='max-md:min-w-0 max-md:overflow-hidden'>
              <BreadcrumbPage className='max-md:block max-md:truncate' title={label}>
                {label}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
