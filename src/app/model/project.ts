import { SimpleUser } from './simple-user';

export interface Project {
  _id: string;
  stringId: string;
  title: string;
  description: string
  manager: SimpleUser;
  idManager: string;
  workers: string[];
  creationDate: string;
  dutyDate: string;
}