import Game from "../lib/Game";

import * as express from "express";

const router = express.Router();

router.get('/:id', async (req, res, next) => {
  const userId = req.headers['x-user'];
  try {
    const game = await Game.getGame(req.params.id, (userId as string));
    if (!game) {
      return res.status(404).send('Game not found');
    }
    res.send(game);
  } catch (err) {
    res.status(400).send({code: err.message});
  }
});

router.post('/:id/chooseWord', async (req, res, next) => {
  try {
    const userId = req.headers['x-user'];
    await Game.chooseWord(req.params.id, (userId as string), req.body.word);
    res.sendStatus(200);
  } catch(err) {
    console.error(err)
    res.status(400).send(err.message);
  }
});

router.post('/:id/submitRound', async (req, res, next) => {
  try {
    const userId = req.headers['x-user'];
    await Game.submitRound(req.params.id, (userId as string), req.body);
    res.sendStatus(200);
  } catch(err) {
    console.error(err)
    res.status(400).send(err.message);
  }
});

router.post('/:id/updateEndScreenState', async (req, res, next) => {
  try {
    await Game.updateEndScreenState(req.params.id, req.body);
    res.sendStatus(200);
  } catch(err) {
    console.error(err)
    res.status(400).send(err.message);
  }
});

export default router;
