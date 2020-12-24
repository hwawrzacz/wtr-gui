import { SimpleUser } from './simple-user';

export enum WorkLogType {
  WORK = 'work',
  BREAK = 'break',
  AUTOBREAK = 'autobreak',
  CLOSE = 'close',
}

export interface WorkLog {
  id: string;
  idUser: string;
  idTask: string;
  logType: WorkLogType;
  user: SimpleUser;
  dateTime: string; // timestamp  
}