const Game = require("../lib/Game");
const Redis = require("../lib/Redis");
module.exports = (io) => {

  io.adapter(Redis.getRedisAdapter());

  io.on('connection', (socket) => {
    let userId;
    socket.on('login', async ({id, name}) => {
      userId = id;
      await Redis.setItem(id, {id, socketId: socket.id, name, activeGames: []})
    });
    socket.on('enterGame', async (data) => {
      socket.join(data.gameId);
      await Game.enterGame(data.gameId, userId);
    });
    socket.on("disconnect", async () => {
      const user = await Redis.getItem(userId);
      for (const game of user.activeGames) {
        await Game.leaveGame(game, user.id);
      }
      user.socketId = null;
      user.activeGames = [];
      await Redis.setItem(userId, user);
    });
  })

};
