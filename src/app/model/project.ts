import { SimpleEmployee } from './simple-employee';

export interface Project {
  id: string;
  stringId: string;
  title: string;
  description: string
  manager: SimpleEmployee;
  workers: string[];
  creationDate: number; // timestamp
  dutyDate: number; // timestamp
}