import { Request, Response, NextFunction } from "express";

type AsyncController = (
  req: Request,
  response: Response,
  next: NextFunction
) => Promise<any>;

export const asyncHandler = (controller: AsyncController) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await controller(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};
