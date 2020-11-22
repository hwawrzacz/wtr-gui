export enum Priority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

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
