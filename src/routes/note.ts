import { Router } from "express";
import { add, deleteNote, getAll, restore, update } from "../controllers/note";
import { auth } from "../middlewares/auth";
import { Validate } from "../middlewares/validate";
import { noteSchema } from "../zodSchemas/note";

export const noteRouter = Router();

noteRouter.post("/", auth, Validate(noteSchema), add);
noteRouter.get("/", auth, getAll);
noteRouter.patch("/:noteId", auth, update);
noteRouter.delete("/:noteId", auth, deleteNote);
noteRouter.patch("/restore/:noteId", auth, restore);
