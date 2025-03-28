import { Request, Response, NextFunction } from "express";
import { AnySchema } from "joi";
import { BadRequestError } from "../types/http-error.type";

const validateParam = <T>(schema: AnySchema<T>) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const value = req.params; // Lấy params từ request
    const result = schema.validate(value);

    if (result.error) {
      const firstError = result.error.details[0];
      return next(new BadRequestError(firstError.message));
    }

    return next();
  };
};

export { validateParam };
