import Game from "../lib/Game";

import * as express from "express";
import Party from "../lib/Party";

const router = express.Router();

router.post('/', async (req, res, next) => {
  const userId = req.headers['x-user'];
  if (!userId) {
    return res.status(400).send('Provide User header')
  }
  const party = await Party.createNewParty(userId);
  res.send(party);
});

router.get('/:id', async (req, res, next) => {
  const partyId = req.params.id;
  const party = await Party.getParty(partyId);
  if (!party) {
    return res.status(404).send('Party not found');
  }
  res.send(party);
});

router.post('/:id/createGame', async (req, res, next) => {
  const partyId = req.params.id;
  try {
    const gameId = await Party.createNewGame(partyId);
    res.status(200).send(gameId);
  } catch(err) {
    console.error(err)
    res.status(400).send(err.message);
  }
});

router.post('/:id/enter', async (req, res, next) => {
  try {
    const userId = req.headers['x-user'];
    const partyId = req.params.id;
    const party = await Party.enterParty(partyId, userId);
    if (!party) {
      res.status(404).send('Party not found');
    }
    res.sendStatus(200);
  } catch(err) {
    console.error(err)
    res.status(400).send(err.message);
  }
});

router.post('/:id/options', async (req, res, next) => {
  try {
    await Party.updateOptions(req.params.id, req.body);
    res.sendStatus(200);
  } catch(err) {
    console.error(err)
    res.status(400).send(err.message);
  }
});

export default router;
