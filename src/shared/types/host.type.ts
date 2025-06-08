import { UserType } from './user-type.enum.js';

export type User = {
  //userId: string;
  name: string;
  email: string;
  avatar: string;
  password: string;
  type: UserType;
};
