export enum Status {
  NEW = 'new',
  IN_PROGRESS = 'in_progress',
  DONE = 'done',
}

export class StatusStringifier {
  static get statusList(): Status[] {
    return Object.values(Status) as Status[];
  }

  public static getStatusString(value: Status): string {
    switch (value) {
      case Status.NEW: return 'New';
      case Status.IN_PROGRESS: return 'In progress';
      case Status.DONE: return 'Done';
      default: return value;
    }
  }
}