import Redis from "../lib/Redis";
import {Player} from "../types/player.type";
import Party from "../lib/Party";

export default (io) => {

  io.adapter(Redis.getRedisAdapter());

  io.on('connection', (socket) => {
    socket.on('login', async ({userId, partyId}) => {
      let user: Player = await Redis.getItem(userId);
      const party = await Redis.getItem(partyId.toLowerCase());
      if (!party) {
        return;
      }
      socket.join(`${userId}-${partyId.toLowerCase()}`);
      user.activeParties.push(partyId.toLowerCase());
      await Redis.setItem(userId, user);
      await Redis.setItem(socket.id, {userId, partyId: partyId.toLowerCase()});
      socket.emit('socketConnectionEstablished');
    });
    socket.on("disconnect", async () => {
      const socketObject = await Redis.getItem(socket.id);
      if (socketObject) {
        const {userId, partyId} = socketObject;
        const user: Player = await Redis.getItem(userId);
        const room = io.sockets.adapter.rooms[`${userId}-${partyId}`];
        if (!room || room.length === 0) {
          await Party.leaveParty(partyId, user.id);
        }
        user.activeParties = user.activeParties.filter(activePartyId => activePartyId !== partyId);
        await Redis.setItem(userId, user);
        await Redis.deleteItem(socket.id);
      }
    });
  })

}
