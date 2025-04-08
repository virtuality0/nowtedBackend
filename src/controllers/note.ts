import { Request, Response } from "express";
import prisma from "../utils/prismaClient";

const add = async (req: Request, res: Response) => {
  const { title, folderId, content } = req.body;
  try {
    const note = await prisma.note.create({
      data: {
        title,
        folderId,
        content,
      },
    });

    res.status(201).json({
      msg: "Note created successfully.",
      id: note.id,
    });
  } catch (err) {
    res.status(500).json({
      msg: `Internal Server Error \n ${(err as Error).message} \n ${
        (err as Error).stack ?? ""
      }`,
    });
  }
};

const getAll = async (req: Request, res: Response) => {
  const folderId = req.query.folderId ?? "";
  try {
    const notes = await prisma.note.findMany({
      where: {
        folderId: {
          equals: folderId.toString(),
        },
        isDeleted: false,
      },
    });

    res.json({
      data: notes,
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
  const noteId = req.params.noteId;
  const updatedBody = req.body;
  try {
    await prisma.note.update({
      where: {
        id: noteId,
      },
      data: {
        modifiedAt: new Date().toISOString(),
        ...updatedBody,
      },
    });

    res.json({
      msg: "Note updated.",
    });
  } catch (err) {
    res.status(500).json({
      msg: `Internal Server Error \n ${(err as Error).message} \n ${
        (err as Error).stack ?? ""
      }`,
    });
  }
};

const deleteNote = async (req: Request, res: Response) => {
  const { noteId } = req.params;
  try {
    await prisma.note.update({
      where: {
        id: noteId,
      },
      data: {
        isDeleted: true,
      },
    });
    res.status(200).json({
      msg: "Note deleted successfully.",
    });
  } catch (err) {
    res.status(500).json({
      msg: `Internal Server Error \n ${(err as Error).message} \n ${
        (err as Error).stack ?? ""
      }`,
    });
  }
};

const restore = async (req: Request, res: Response) => {
  const { noteId } = req.params;
  try {
    await prisma.note.update({
      where: {
        id: noteId,
      },
      data: {
        isDeleted: false,
      },
    });
    res.status(200).json({
      msg: "Note restored successfully.",
    });
  } catch (err) {
    res.status(500).json({
      msg: `Internal Server Error \n ${(err as Error).message} \n ${
        (err as Error).stack ?? ""
      }`,
    });
  }
};

export { add, getAll, update, deleteNote, restore };
