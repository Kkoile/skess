const Game =  require("../lib/Game");

var express = require('express');
var router = express.Router();

router.post('/createGame', async (req, res, next) => {
  const host = req.headers['x-user'];
  if (!host) {
    return res.status(400).send('Provide User header')
  }
  const gameIdentifier = await Game.createNewGame(host, req.query.previousGame);
  res.send({id: gameIdentifier});
});

router.get('/game/:id', async (req, res, next) => {
  const userId = req.headers['x-user'];
  const game = await Game.getGame(req.params.id, userId);
  if (!game) {
    return res.status(404).send('Game not found');
  }
  res.send(game);
});

router.post('/game/:id/start', async (req, res, next) => {
  try {
    await Game.start(req.params.id, req.query);
    res.sendStatus(200);
  } catch(err) {
    console.error(err)
    res.status(400).send(err.message);
  }
});

router.post('/game/:id/chooseWord', async (req, res, next) => {
  try {
    const userId = req.headers['x-user'];
    await Game.chooseWord(req.params.id, userId, req.body.word);
    res.sendStatus(200);
  } catch(err) {
    console.error(err)
    res.status(400).send(err.message);
  }
});

router.post('/game/:id/submitRound', async (req, res, next) => {
  try {
    const userId = req.headers['x-user'];
    await Game.submitRound(req.params.id, userId, req.body);
    res.sendStatus(200);
  } catch(err) {
    console.error(err)
    res.status(400).send(err.message);
  }
});

module.exports = router;
