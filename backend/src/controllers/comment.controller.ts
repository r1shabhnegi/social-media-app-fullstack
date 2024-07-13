// import {}

import { Request, Response } from "express";
// import { tryCatch } from "../utility/tryCatch";
import { Comment } from "../models/comment.model";
// import { ApiError } from "../utility/apiError";

const create = async (req: Request, res: Response) => {
  try {
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
    if (!newComment)
      return res.send(500).json({ error: "error creating comment" });

    await newComment.save();
    // throw new ApiError("error creating comment", 2000, 2000);
    // throw new Error("Error creating comment");

    res.status(200).json({ message: "comment created comment" });
  } catch (error) {
    return res.status(500).json(`${error || "Something went wrong"} `);
  }
};

const getComments = async (req: Request, res: Response) => {
  try {
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
  } catch (error) {
    return res.status(500).json(`${error || "Something went wrong"} `);
  }
};

export { create, getComments };
