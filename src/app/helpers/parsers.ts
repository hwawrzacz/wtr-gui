import { Employee } from '../model/employee';
import { Priority } from '../model/enums/priority';
import { Status } from '../model/enums/status';
import { SimpleEmployee } from '../model/simple-employee';

export const stringifyEmployee = (employee: Employee | SimpleEmployee) => `${employee.firstName} ${employee.lastName}`;

export class PriorityStringifier {
  static get prioritiesList(): Priority[] {
    return Object.values(Priority) as Priority[];
  }

  public static getPriorityString(value: Priority): string {
    switch (value) {
      case Priority.LOW: return 'Low';
      case Priority.MEDIUM: return 'Medium';
      case Priority.HIGH: return 'High';
      default: return value;
    }
  }
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
