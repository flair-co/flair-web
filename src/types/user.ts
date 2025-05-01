import {AuthMethod} from './auth-method';

export type User = {
  id: string;
  name: string;
  email: string;
  isEmailVerified: boolean;
  createdAt: Date;
  authMethods: AuthMethod[];
};
