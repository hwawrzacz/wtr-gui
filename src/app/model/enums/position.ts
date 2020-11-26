export enum Position {
  EMPLOYEE = 'employee',
  MANAGER = 'manager',
  ADMIN = 'admin',
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