import { Employee } from '../model/employee';
import { Position } from '../model/enums/position';
import { Priority } from '../model/enums/priority';
import { Status } from '../model/enums/status';
import { SimpleEmployee } from '../model/simple-employee';
import { WorkLogType } from '../model/work-log';

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

export class WorkLogTypeStringifier {
  static get statusList(): WorkLogType[] {
    return Object.values(WorkLogType) as WorkLogType[];
  }

  public static getTypeString(value: WorkLogType): string {
    switch (value) {
      case WorkLogType.BREAK: return 'Break';
      case WorkLogType.AUTOBREAK: return 'Autobreak';
      case WorkLogType.WORK: return 'Work';
      default: return value;
    }
  }
}

export class PositionStringifier {
  static get positionList(): Position[] {
    return Object.values(Position) as Position[];
  }

  public static getPositionString(value: Position): string {
    switch (value) {
      case Position.EMPLOYEE: return 'Employee';
      case Position.MANAGER: return 'Manager';
      case Position.ADMIN: return 'Admin';
      default: return value;
    }
  }
}
