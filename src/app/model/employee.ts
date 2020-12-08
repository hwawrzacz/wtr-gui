import { Position } from './enums/position';

export interface Employee {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  position: Position
  login: string;
  password: string;
  faceImage: string;
  qrImage: string;
}