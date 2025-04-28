import { Request, Response } from "express";
import prisma from "../utils/prismaClient";

const add = async (req: Request, res: Response) => {
  const { title, folderId, content } = req.body;
  const preview = content.slice(0, 15) + (content.length > 15 ? "..." : "");
  try {
    const note = await prisma.note.create({
      data: {
        title,
        folderId,
        content,
        preview,
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

const getByFolderId = async (req: Request, res: Response) => {
  const { folderId, page = 1, limit = 10 } = req.query;
  try {
    const folder = await prisma.folder.findFirst({
      where: {
        id: folderId?.toString(),
      },
    });

    if (!folder) {
      res.status(400).json({
        msg: "Invalid folder id.",
      });

      return;
    }

    const totalDocuments = await prisma.note.count({
      where: {
        folderId: {
          equals: folderId?.toString(),
        },
        isDeleted: false,
      },
    });

    const notes = await prisma.note.findMany({
      where: {
        folderId: {
          equals: folderId?.toString(),
        },
        isDeleted: false,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: (parseInt(page.toString()) - 1) * parseInt(limit.toString()),
      take: parseInt(page.toString()) * parseInt(limit.toString()),
    });

    res.json({
      data: notes,
      folderName: folder.name,
      total: totalDocuments,
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

  if (!updatedBody.title) {
    res.status(400).json({
      msg: "Empty title.",
    });

    return;
  }
  try {
    await prisma.note.update({
      where: {
        id: noteId,
      },
      data: {
        modifiedAt: new Date().toISOString(),
        preview:
          updatedBody.content.slice(0, 15) +
          (updatedBody.content.length > 15 ? "..." : ""),
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

const recent = async (req: Request, res: Response) => {
  const { isDeleted, isFavorite, isArchived } = req.query;
  try {
    const notes = await prisma.note.findMany({
      where: {
        isDeleted: {
          equals: isDeleted === "true",
        },
        isArchived: {
          equals: isArchived === "true",
        },
        isFavorite: {
          equals: isFavorite === "true",
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({
      data: notes,
      total: notes.length,
      folderName: "Recent Notes",
    });
  } catch (err) {
    res.status(500).json({
      msg: `Internal Server Error \n ${(err as Error).message} \n ${
        (err as Error).stack ?? ""
      }`,
    });
  }
};

const getById = async (req: Request, res: Response) => {
  const noteId = req.params.noteId ?? "";
  try {
    const note = await prisma.note.findFirst({
      where: {
        id: {
          equals: noteId.toString(),
        },
        isDeleted: false,
      },
      include: {
        folder: true,
      },
    });

    if (!note) {
      res.status(400).json({
        msg: "Invalid note id",
      });
      return;
    }

    res.json({
      data: note,
    });
  } catch (err) {
    res.status(500).json({
      msg: `Internal Server Error \n ${(err as Error).message} \n ${
        (err as Error).stack ?? ""
      }`,
    });
  }
};

export { add, getByFolderId, update, deleteNote, restore, recent, getById };
