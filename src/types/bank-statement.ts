import {BankAccount} from './bank-account';
import {FileEntity} from './file';
import {Transaction} from './transaction';

type Period = {start: Date; end: Date};

export type BankStatement = {
  id: string;
  file: FileEntity;
  transactions: Transaction[];
  bankAccount: BankAccount;
  period: Period;
  uploadedAt: Date;
};

export type UploadJob = {
  id: string;
  progress: number;
  status: JobStatus;
  result?: BankStatement;
  failedReason?: string;
  jobId: string;
};

type JobStatus = 'active' | 'completed' | 'failed' | 'waiting';
