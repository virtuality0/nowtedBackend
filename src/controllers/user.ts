import { Request, Response } from "express";
import prisma from "../utils/prismaClient";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const signUp = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    const user = await prisma.user.findFirst({
      where: {
        username: username,
      },
    });
    if (user) {
      res.status(400).json({
        msg: "User already exists.",
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
      },
    });

    res.status(201).json({
      msg: "User signed up successfully.",
    });
  } catch (err) {
    res.status(500).json({
      msg: `Internal Server Error. \n ${(err as Error).message} \n ${
        (err as Error).stack ?? ""
      }`,
    });
  }
};

export const signin = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    const user = await prisma.user.findFirst({
      where: {
        username: username,
      },
    });
    if (!user) {
      res.status(401).json({
        msg: "Invalid username or password.",
      });
      return;
    }
    const isMatch = bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({
        msg: "Invalid username or password.",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
      },
      process.env.JWT_SECRET ?? "",
      { expiresIn: "24h" }
    );

    const cookieOptions = {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      secure: true,
    };

    res.cookie("Authorization", token, cookieOptions);

    res.json({
      msg: "Signin in successfully",
      token: token,
    });
  } catch (err) {
    res.status(500).json({
      msg: `Internal Server Error. \n ${(err as Error).message} \n ${
        (err as Error).stack ?? ""
      }`,
    });
  }
};
