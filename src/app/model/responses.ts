import { CommonArrayResponse } from "./common-array-response";
import { CreationResponseMessage, DeletionResponseMessage, GetResponseMessage } from "./enums/response-messages";

export interface CommonResponse<M, O> {
  success: boolean;
  message?: M;
  details?: O;
}

export interface CreationResponse extends CommonResponse<CreationResponseMessage, any> { }

export interface DeletionResponse extends CommonResponse<DeletionResponseMessage, any> { }

export interface ArrayResponse<T> extends CommonResponse<GetResponseMessage, CommonArrayResponse<T>> { }

export interface SingleItemResponse<T> extends CommonResponse<GetResponseMessage, T> { }
