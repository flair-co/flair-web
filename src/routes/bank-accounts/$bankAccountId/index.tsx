import {createFileRoute, redirect} from '@tanstack/react-router';

import {AppBody} from '@/components/shared/layout/app-body';
import {AppHeader} from '@/components/shared/layout/app-header';
import {useGetBankAccount} from '@/features/bank-account/api/use-get-bank-account';
import {BankAccountBreadcrumb} from '@/features/bank-account/components/bank-account-breadcrumb';
import {BankAccountDetails} from '@/features/bank-account/components/bank-account-details';

export const Route = createFileRoute('/bank-accounts/$bankAccountId/')({
  component: BankAccountIndex,
  beforeLoad: ({context}) => {
    if (!context.isAuthenticated) {
      throw redirect({to: '/login'});
    }
  },
});

function BankAccountIndex() {
  const {bankAccountId} = Route.useParams();
  const {bankAccount} = useGetBankAccount(bankAccountId);

  return (
    <>
      <AppHeader>
        <BankAccountBreadcrumb bankAccount={bankAccount} />
      </AppHeader>
      <AppBody>{bankAccount && <BankAccountDetails bankAccount={bankAccount} />}</AppBody>
    </>
  );
}
