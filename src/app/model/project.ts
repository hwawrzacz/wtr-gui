import { SimpleUser } from './simple-user';

export interface Project {
  id: string;
  stringId: string;
  title: string;
  description: string
  manager: SimpleUser;
  workers: string[];
  creationDate: string;
  dutyDate: string;
}