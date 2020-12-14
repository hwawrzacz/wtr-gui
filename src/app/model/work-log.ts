import { SimpleUser } from './simple-user';

export enum WorkLogType {
  WORK = 'work',
  BREAK = 'break',
  AUTOBREAK = 'autobreak',
  CLOSE = 'close',
}

export interface WorkLog {
  id: string;
  taskId: number;
  user: SimpleUser;
  dateTime: number; // timestamp  
  type: WorkLogType;
}