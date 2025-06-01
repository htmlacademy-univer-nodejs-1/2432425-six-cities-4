import { User } from './host.type.js';

export type Comment = {
  text: string;
  postDate: Date;
  rating: number;
  host: User;
}
