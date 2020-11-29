import { SimpleEmployee } from './simple-employee';

export enum WorkLogType {
  WORK = 'work',
  BREAK = 'break',
  AUTOBREAK = 'autobreak',
  CLOSE = 'close',
}

export interface WorkLog {
  id: string;
  taskId: number;
  employee: SimpleEmployee;
  dateTime: number; // timestamp  
  type: WorkLogType;
}