import {MimeTypeIcon} from '@/components/shared/mime-type-icon';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {BankStatement} from '@/types/bank-statement';

import {BankStatementActions} from '../file/bank-statement-actions';

type BankStatementCardProps = {
  bankStatement: BankStatement;
};

export function BankStatementCard({bankStatement}: BankStatementCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className='flex items-start justify-between'>
          <div className='rounded bg-muted p-2'>
            <MimeTypeIcon mimeType={bankStatement.file.mimeType} />
          </div>
          <BankStatementActions bankStatement={bankStatement} />
        </div>
      </CardHeader>
      <CardContent>
        <CardTitle className='truncate text-lg'>{bankStatement.file.name}</CardTitle>
        <p className='text-sm text-muted-foreground'>
          Uploaded on {new Date(bankStatement.uploadedAt).toLocaleDateString()}
        </p>
      </CardContent>
    </Card>
  );
}
