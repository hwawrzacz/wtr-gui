import { SimpleEmployee } from './model';

export interface Project {
  id: number;
  stringId: string;
  title: string;
  description: string
  manager: SimpleEmployee;
  workers: number[];
  creationDate: number; // timestamp
  dutyDate: string; // timestamp
}