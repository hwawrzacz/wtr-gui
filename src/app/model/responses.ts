import { CreationResponseMessage } from "./enums/response-messages";

export interface CreationResponse extends CommonResponse<CreationResponseMessage> { }

export interface CommonResponse<T> {
  success: boolean;
  message: T;
}