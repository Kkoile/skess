import Redis from "../lib/Redis";
import {Player} from "../types/player.type";
import Party from "../lib/Party";

export default (io) => {

  io.adapter(Redis.getRedisAdapter());

  io.on('connection', (socket) => {
    socket.on('login', async ({userId, partyId}) => {
      let user: Player = await Redis.getItem(userId);
      user.activeParties.push({partyId, socketId: socket.id});
      await Redis.setItem(userId, user);
      await Redis.setItem(socket.id, userId);
      socket.emit('socketConnectionEstablished');
    });
    socket.on("disconnect", async () => {
      const userId = await Redis.getItem(socket.id);
      if (userId) {
        const user: Player = await Redis.getItem(userId);
        console.log('disconneting ' + user.name)
        const activeParty = user.activeParties.find(party => party.socketId === socket.id);
        if(activeParty) {
          await Party.leaveParty(activeParty.partyId, user.id);
        }
        user.activeParties = user.activeParties.filter(party => party.socketId !== socket.id);
        await Redis.setItem(userId, user);
        await Redis.deleteItem(socket.id);
      }
    });
  })

}
