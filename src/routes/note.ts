import { Router } from "express";
import {
  add,
  deleteNote,
  getByFolderId,
  getById,
  recent,
  restore,
  update,
} from "../controllers/note";
import { auth } from "../middlewares/auth";
import { Validate } from "../middlewares/validate";
import { noteSchema } from "../zodSchemas/note";

export const noteRouter = Router();

noteRouter.post("/", auth, Validate(noteSchema), add);
noteRouter.get("/", auth, getByFolderId);
noteRouter.patch("/:noteId", auth, update);
noteRouter.delete("/:noteId", auth, deleteNote);
noteRouter.patch("/restore/:noteId", auth, restore);
noteRouter.get("/recent", auth, recent);
noteRouter.get("/:noteId", auth, getById);
