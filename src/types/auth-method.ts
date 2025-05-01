export enum AuthMethodType {
  LOCAL = 'local',
  GOOGLE = 'google',
}

type LocalAuthMethod = {
  type: AuthMethodType.LOCAL;
  providerId: null;
};

type GoogleAuthMethod = {
  type: AuthMethodType.GOOGLE;
  providerId: string;
};

export type AuthMethod = LocalAuthMethod | GoogleAuthMethod;
