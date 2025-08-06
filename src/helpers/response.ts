// src/helpers/response.ts
import { Response } from 'express';

type ApiResponse<T> = {
  status: number;
  message: string;
  data: T;
};

type ApiErrorResponse<E> = {
  status: number;
  message: string;
  error: E;
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

export const sendError = <E>(
  res: Response,
  status: number,
  message: string,
  error: E,
) => {
  const errorResponse: ApiErrorResponse<E> = {
    status,
    message,
    error,
  };
  return res.status(status).json(errorResponse);
};
