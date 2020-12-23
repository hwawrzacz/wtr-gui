import { User } from '../model/user';
import { Position } from '../model/enums/position';
import { Priority } from '../model/enums/priority';
import { Status } from '../model/enums/status';
import { SimpleUser } from '../model/simple-user';
import { WorkLogType } from '../model/work-log';
import { CreationResponseMessage } from '../model/enums/response-messages';

export const stringifyUser = (user: User | SimpleUser) => `${user.firstName} ${user.lastName}`;

export class PriorityStringifier {
  static get prioritiesList(): Priority[] {
    return Object.values(Priority) as Priority[];
  }

  public static getPriorityString(value: Priority): string {
    switch (value) {
      case Priority.LOW: return 'Niski';
      case Priority.MEDIUM: return 'Normalny';
      case Priority.HIGH: return 'Wysoki';
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
      case Status.NEW: return 'Nowe';
      case Status.IN_PROGRESS: return 'W trakcie';
      case Status.DONE: return 'Zakończone';
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
      case WorkLogType.BREAK: return 'Przerwa';
      case WorkLogType.AUTOBREAK: return 'Przerwa automatyczna';
      case WorkLogType.WORK: return 'Praca';
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
      case Position.EMPLOYEE: return 'Pracownik';
      case Position.MANAGER: return 'Menedżer';
      case Position.ADMIN: return 'Administrator';
      default: return value;
    }
  }
}

export class CreationResponseParser {
  public static parseCreationResponseMessage(message: CreationResponseMessage) {
    switch (message) {
      case CreationResponseMessage.LOGIN_IS_TAKEN: {
        return 'Login jest już zajęty';
      }
      case CreationResponseMessage.INVALID_DUTY_DATE: {
        return 'Termin zakończenia jest nieprawidłowy';
      }
      case CreationResponseMessage.PROJECT_VALIDATION_FAILED: {
        return 'Pola nie są poprawne';
      }
      default: {
        return 'Podczas tworzenia elementu wystąpił błąd.';
      };
    }
  }
}