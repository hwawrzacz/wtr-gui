import { Employee } from './employee';

export interface Project {
  id: number;
  stringId: string;
  title: string;
  description: string;
  // TODO (HW): Change string to Employee. String is just a temporary solution for mockup
  manager: string;
  workersCount: number;
}