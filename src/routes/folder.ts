import { Router } from "express";
import { add, deleteFolder, getAll, update } from "../controllers/folder";
import { Validate } from "../middlewares/validate";
import { folderSchema } from "../zodSchemas/folder";
import { auth } from "../middlewares/auth";

export const folderRouter = Router();

folderRouter.post("/", Validate(folderSchema), auth, add);
folderRouter.get("/", auth, getAll);
folderRouter.delete("/:folderId", auth, deleteFolder);
folderRouter.patch("/:folderId", auth, update);
