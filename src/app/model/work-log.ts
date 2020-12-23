import { SimpleUser } from './simple-user';

export enum WorkLogType {
  WORK = 'work',
  BREAK = 'break',
  AUTOBREAK = 'autobreak',
  CLOSE = 'close',
}

export interface WorkLog {
  id: string;
  taskId: string;
  userId: string;
  type: WorkLogType;
  user: SimpleUser;
  dateTime: number; // timestamp  
}