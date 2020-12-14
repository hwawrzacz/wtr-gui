import { Position } from './enums/position';

export interface SimpleUser {
  _id: string;
  login: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: Position;
}