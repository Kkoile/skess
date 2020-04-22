const Game = require("../lib/Game");
const Redis = require("../lib/Redis");
module.exports = (io) => {

  io.adapter(Redis.getRedisAdapter());

  io.on('connection', (socket) => {
    socket.on('login', async ({id, name}) => {
      await Redis.setItem(id, {id, socketId: socket.id, name, activeGames: []})
      await Redis.setItem(socket.id, id);
    });
    socket.on('enterGame', async (data) => {
      socket.join(data.gameId);
      const userId = await Redis.getItem(socket.id);
      await Game.enterGame(data.gameId, userId);
    });
    socket.on("disconnect", async () => {
      const userId = await Redis.getItem(socket.id);
      if (userId) {
        const user = await Redis.getItem(userId);
        for (const game of user.activeGames) {
          await Game.leaveGame(game, user.id);
        }
        user.socketId = null;
        user.activeGames = [];
        await Redis.setItem(userId, user);
        await Redis.deleteItem(socket.id);
      }
    });
  })

};
