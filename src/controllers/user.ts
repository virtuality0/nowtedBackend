import { CookieOptions, Request, Response } from "express";
import prisma from "../utils/prismaClient";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const signUp = async (req: Request, res: Response) => {
  const { email, username, password } = req.body;
  try {
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          {
            username: {
              equals: username,
            },
          },
          {
            email: {
              equals: email,
            },
          },
        ],
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
        email,
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

const signin = async (req: Request, res: Response) => {
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

    const cookieOptions: CookieOptions = {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    };

    res.cookie("Authorization", token, cookieOptions);

    res.json({
      msg: "Signed in successfully",
    });
  } catch (err) {
    res.status(500).json({
      msg: `Internal Server Error. \n ${(err as Error).message} \n ${
        (err as Error).stack ?? ""
      }`,
    });
  }
};

const signOut = (_: Request, res: Response) => {
  res.cookie("Authorization", "");
  res.json({
    msg: "User signed out.",
  });
};

export { signUp, signin, signOut };
