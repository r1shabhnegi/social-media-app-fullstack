// import {}

import { Request, Response } from "express";
// import { tryCatch } from '../utility/tryCatch';
import { Comment } from "../models/comment.model";
// import { ApiError } from '../utility/apiError';

const create =
  //  tryCatch(
  async (req: Request, res: Response) => {
    const { userId, postId, content, username } = req.body;
    //   console.log(userId, postId, content);
    const rr = content;
    console.log(rr);
    const newComment = new Comment({
      content: content,
      authorId: userId,
      authorName: username,
      postId: postId,
    });

    await newComment.save();
    console.log(newComment);
    if (!newComment) throw new Error("Error creating comment");
    // ApiError("error creating comment", 2000, 2000);

    res.status(200).json({ message: "comment created comment" });
  };
// );

const getComments =
  //  tryCatch(
  async (req: Request, res: Response) => {
    const { postId, commentPage } = req.params;
    //   console.log(postId);

    const skipComment = +commentPage * 10;
    const limit = 10;
    const comments = await Comment.find({ postId: postId })
      .skip(skipComment)
      .limit(limit)
      .sort({ createdAt: -1 });

    //   console.log(comments);
    res.status(200).send(comments);
  };
// );

export { create, getComments };
