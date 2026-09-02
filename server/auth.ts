import type { NextFunction, Request, Response } from "express";

export type AuthenticatedRequest = Request & {
  user: {
    id: string;
    displayName: string;
  };
};

export function authenticatedUser(request: Request) {
  return (request as AuthenticatedRequest).user;
}

export function demoAuth(
  request: Request,
  _response: Response,
  next: NextFunction,
) {
  (request as AuthenticatedRequest).user = {
    id: "reviewer-1",
    displayName: "Dr. Maya Chen",
  };
  next();
}
