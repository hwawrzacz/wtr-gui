import { CommonArrayResponse } from "./common-array-response";
import { CreationResponseMessage as PatchResponseMessage, DeletionResponseMessage, GetResponseMessage } from "./enums/response-messages";

export interface CommonResponse<M, O> {
  success: boolean;
  message?: M;
  details?: O;
}

export interface PatchResponse extends CommonResponse<PatchResponseMessage, any> { }

export interface ArrayResponse<T> extends CommonResponse<GetResponseMessage, CommonArrayResponse<T>> { }

export interface SingleItemResponse<T> extends CommonResponse<GetResponseMessage, T> { }
