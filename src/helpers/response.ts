// src/helpers/response.ts
import { Response } from 'express';

type ApiResponse<T> = {
  status: number;
  message: string;
  data: T;
};

type ApiErrorResponse = {
  status: number;
  message: string;
};

export const sendResponse = <T>(
  res: Response,
  status: number,
  message: string,
  data: T,
) => {
  const response: ApiResponse<T> = {
    status,
    message,
    data,
  };
  return res.status(status).json(response);
};

export const sendError = (res: Response, status: number, message: string) => {
  const errorResponse: ApiErrorResponse = {
    status,
    message,
  };
  return res.status(status).json(errorResponse);
};
