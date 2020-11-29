import { Employee } from './employee';

export enum WorkLogType {
  WORK = 'work',
  BREAK = 'break',
  AUTOBREAK = 'autobreak',
  CLOSE = 'close',
}

export interface WorkLog {
  id: string;
  taskId: number;
  employee: Employee;
  dateTime: number; // timestamp  
  type: WorkLogType;
}