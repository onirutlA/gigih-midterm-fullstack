import express from 'express';
import {
  VideoModel,
  videoCreationValidatorSchema,
  videoDeletionValidatorSchema,
} from '../model/video';

const videoRouter = express.Router();
const videoEnpoint = '/videos';

videoRouter.get(videoEnpoint, async (_req, res) => {
  try {
    const videos = await VideoModel.find({});
    res.status(200).json(videos).end();
  } catch (e) {
    console.error(e);
    res.status(500).send(`Unknown error with error: ${e}`).end();
  }
});

videoRouter.post(videoEnpoint, videoCreationValidatorSchema, async (req, res) => {
  const { urlImage, thumbnail, title, comments } = req.body;

  try {
    const newVideo = await VideoModel.create({ urlImage, thumbnail, title, comments });
    console.log(`video saved with data ${newVideo}`);
    res.status(201).send(`Video saved with data ${newVideo}`).end();
  } catch (e) {
    console.error(e);
    res.status(500).send(`Video failed to save with error: ${e}`).end();
  }
});

videoRouter.put(videoEnpoint, async (req, res) => {
  const { videoId, urlImage, thumbnail, title } = req.body;

  try {
    const updatedVideo = VideoModel.findOneAndUpdate(
      { _id: videoId },
      { urlImage, thumbnail, title },
      { new: true, upsert: true },
    );

    if (updatedVideo === null) {
      console.error('Unknown error while updating video video is not updated').end();
      res.status(500).send('Unknown error while updating video video is not updated').end();
      return;
    }
    res.status(200).send(`video updated with data ${updatedVideo}`).end();
  } catch (e) {
    console.error(e);
    res.status(500).send(e).end();
  }
});

videoRouter.delete(videoEnpoint, videoDeletionValidatorSchema, async (req, res) => {
  const { videoId } = req.body;

  try {
    await VideoModel.findByIdAndDelete({ _id: videoId });
    res.status(200).send(`Video deletion with id: ${videoId} is succesful`).end();
  } catch (e) {
    console.error(e);
    res.status(500).send(`Video deletion with id: ${videoId} failed with error: ${e}`).end();
  }
});

export default videoRouter;
