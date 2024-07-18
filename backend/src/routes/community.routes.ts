import { Router } from "express";
import { upload } from "../middlewares/multer.middleware";

import {
  getCommunity,
  createCommunity,
  findCommunities,
  joinCommunity,
  getCommunities,
  leaveCommunity,
  editCommunity,
  getModCommunities,
  deleteCommunity,
} from "../controllers/community.controllers";

const router = Router();

router.get("/find-communities/:page", findCommunities);

router.get("/get-community/:comId", getCommunity);

router.get("/get-user-communities-list", getCommunities);

router.get("/get-user-mod-communities", getModCommunities);

router.post(
  "/create/edit-community",
  // upload.fields([
  //   { name: "avatarImg", maxCount: 1 },
  //   { name: "coverImg", maxCount: 1 },
  // ]),
  editCommunity
);

router.post("/create", createCommunity);

router.post("/join-community", joinCommunity);

router.post("/leave-community", leaveCommunity);

router.post("/delete-community", deleteCommunity);

export default router;
