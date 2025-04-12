import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export const auth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.Authorization ?? "";
  try {
    if (!token) {
      res.status(401).json({
        msg: "Not logged in.",
      });
      return;
    }
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET ?? ""
    ) as JwtPayload;
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(500).json({
      msg: `Internal Server Error \n ${(err as Error).message} \n ${
        (err as Error).stack ?? ""
      }`,
    });
  }
};
