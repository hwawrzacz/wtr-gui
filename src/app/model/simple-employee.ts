import { Position } from './enums/position';

export interface SimpleEmployee {
  _id: string;
  login: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  position: Position;
}