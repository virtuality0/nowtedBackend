import { NextFunction, Request, Response } from "express";
import { z, ZodError } from "zod";

export const Validate = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const errorMessages = err.errors.map((item) => {
          return {
            message: `${item.path.join(".")} : ${item.message}`,
          };
        });

        res.status(400).json({
          msg: errorMessages,
        });
      } else {
        res.status(500).json({
          msg: `Internal Server Error \n ${(err as Error).message} \n ${
            (err as Error).stack ?? ""
          }`,
        });
      }
    }
  };
};
