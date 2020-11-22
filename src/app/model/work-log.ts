export enum WorkLogType {
  WORK = 'work',
  BREAK = 'break',
  AUTOBREAK = 'autobreak',
  CLOSE = 'close',
}

export interface WorkLog {
  id: number;
  taskId: number;
  userId: number;
  dateTime: number; // timestamp  
  type: WorkLogType;
}