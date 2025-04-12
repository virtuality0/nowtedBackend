import { Request, Response } from "express";
import prisma from "../utils/prismaClient";

const getAll = async (req: Request, res: Response) => {
  const userId = req.userId;
  try {
    const folders = await prisma.folder.findMany({
      where: {
        userId: {
          equals: userId,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({
      data: folders,
      total: folders.length,
    });
  } catch (err) {
    res.status(500).json({
      msg: `Internal Server Error \n ${(err as Error).message} \n ${
        (err as Error).stack ?? ""
      }`,
    });
  }
};

const add = async (req: Request, res: Response) => {
  const userId = req.userId ?? "";
  const { name } = req.body;
  try {
    const folder = await prisma.folder.create({
      data: {
        name,
        userId,
      },
    });

    res.status(201).json({
      msg: "Folder created successfully.",
      id: folder.id,
    });
  } catch (err) {
    res.status(500).json({
      msg: `Internal Server Error \n ${(err as Error).message} \n ${
        (err as Error).stack ?? ""
      }`,
    });
  }
};

const deleteFolder = async (req: Request, res: Response) => {
  const { folderId } = req.params;
  try {
    await prisma.folder.delete({
      where: {
        id: folderId,
      },
    });
    res.status(200).json({
      msg: "Folder deleted successfully.",
    });
  } catch (err) {
    res.status(500).json({
      msg: `Internal Server Error \n ${(err as Error).message} \n ${
        (err as Error).stack ?? ""
      }`,
    });
  }
};

const update = async (req: Request, res: Response) => {
  const { folderId } = req.params;
  const updatedBody = req.body;
  try {
    await prisma.folder.update({
      where: {
        id: folderId,
      },
      data: {
        name: updatedBody.name,
        modifiedAt: new Date().toLocaleDateString(),
      },
    });

    res.json({
      msg: "Folder updated.",
    });
  } catch (err) {
    res.status(500).json({
      msg: `Internal Server Error \n ${(err as Error).message} \n ${
        (err as Error).stack ?? ""
      }`,
    });
  }
};

export { add, getAll, deleteFolder, update };
