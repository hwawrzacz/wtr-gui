import { SimpleEmployee } from './simple-employee';

export interface Project {
  id: number;
  stringId: string;
  title: string;
  description: string
  manager: SimpleEmployee;
  workers: number[];
  creationDate: number; // timestamp
  dutyDate: number; // timestamp
}