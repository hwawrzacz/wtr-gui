import { CreationResponseMessage } from "./enums/creation-response-message";

export interface CreationResponse {
  success: boolean;
  message: CreationResponseMessage;
}