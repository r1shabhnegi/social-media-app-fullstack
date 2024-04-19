import { Response, Request } from 'express';
import { tryCatch } from '../utility/tryCatch';

const createPost = tryCatch(async (req: Request, res: Response) => {
  const { title, description, communityName } = req.body;

  //   const foundPost

  const file = req.files;
  console.log(title, file);
});

export { createPost };
