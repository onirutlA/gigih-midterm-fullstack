import express from 'express';
import {
  CommentModel,
  commentQueryValidatorSchema,
  commentBodyValidatorSchema,
} from '../model/comment';

const commentRouter = express.Router();
const commentEndpoint = '/comments';

commentRouter.get(commentEndpoint, commentQueryValidatorSchema, async (req, res) => {
  const { videoId } = req.query;
  const comments = await CommentModel.find({ videoId }).exec();

  res.status(200).json(comments).end();
});

commentRouter.post(commentEndpoint, commentBodyValidatorSchema, async (req, res) => {
  const { videoId, username, comment } = req.body;
  try {
    const newComment = await CommentModel.create({ videoId, username, comment });
    res.status(201).send(`Comment saved with data ${newComment}`).end();
    console.log(`Comment saved with data ${newComment}`);
  } catch (e) {
    res.status(500).send(`Comment failed to saved with error: ${e}`).end();
    console.err(e);
  }
});

commentRouter.put(commentEndpoint, commentBodyValidatorSchema, async (req, res) => {
  const { commentId, username, comment } = req.body;

  try {
    const updatedComment = await CommentModel.findOneAndUpdate(
      { _id: commentId },
      { username, comment },
      { new: true, upsert: true },
    );
    if (updatedComment === null) {
      res.status(500).send(`Unknown error while updating comment, comment is not updated`).end();
      return;
    }
    res.status(200).send(`comment updated with data ${updatedComment}`).end();
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send(`Unknown error while updating comment with error: ${error}, comment is not updated`)
      .end();
    res.status(500).send(error).end();
  }
});

commentRouter.delete(commentEndpoint, async (req, res) => {
  const { commentId } = req.body;
  try {
    await CommentModel.findByIdAndDelete({ _id: commentId });
    res.status(200).send(`Comment deletion is successed with id: ${commentId}`);
  } catch (e) {
    res.status(500).send(`Comment deletion is failed because ${e}`);
    console.error(e);
  }
});

export default commentRouter;
