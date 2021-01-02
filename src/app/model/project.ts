import { SimpleUser } from './simple-user';
import { User } from './user';

export interface Project {
  _id: string;
  stringId: string;
  title: string;
  description: string
  manager: SimpleUser;
  idManager: string | User;
  workers: string[];
  creationDate: string;
  dutyDate: string;
}