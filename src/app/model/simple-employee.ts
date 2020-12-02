import { Position } from './enums/position';

export interface SimpleEmployee {
  id: string;
  login: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  position: Position;
}