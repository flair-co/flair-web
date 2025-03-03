import {Link} from '@tanstack/react-router';

import {DynamicBankIcon} from '@/components/shared/dynamic-bank-icon';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {Account} from '@/types/account';
import {BankStatement} from '@/types/bank-statement';

type AccountBreadcrumbProps = {
  account?: Account;
  bankStatements?: boolean;
  bankStatement?: BankStatement;
};

export function AccountBreadcrumb({account, bankStatements}: AccountBreadcrumbProps) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to='/home'>Home</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          {account ? (
            <BreadcrumbLink asChild>
              <Link to='/accounts'>Accounts</Link>
            </BreadcrumbLink>
          ) : (
            <BreadcrumbPage>Accounts</BreadcrumbPage>
          )}
        </BreadcrumbItem>
        {account && !bankStatements && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className='flex items-center'>
                <div className='mr-1 rounded-md bg-muted p-[0.2rem]'>
                  <DynamicBankIcon bank={account.bank} className='h-3 w-3' />
                </div>
                {account.alias ? account.alias : account.bank}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
        {account && bankStatements && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link
                  to={`/accounts/$accountId`}
                  params={{accountId: account.id}}
                  className='flex items-center'
                >
                  <div className='mr-1 rounded-md bg-muted p-[0.2rem]'>
                    <DynamicBankIcon bank={account.bank} className='h-3 w-3' />
                  </div>
                  {account.alias ? account.alias : account.bank}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Bank Statements</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
