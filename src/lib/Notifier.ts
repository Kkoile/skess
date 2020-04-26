import Redis from "./Redis";
import {Player} from "../types/player.type";
import ConfigService from "./ConfigService";
import {Game} from "../types/game.type";
import {Party} from "../types/party.type";
const io = require('socket.io-emitter')(ConfigService.getRedisConfiguration());

const notifyPlayer = async (userId: string, partyId: string, event: string, payload: any) => {
    const user: Player = await Redis.getItem(userId);
    const party = user.activeParties.find(party => party.partyId === partyId);
    if (party && party.socketId) {
        io.to(party.socketId).emit(event, payload);
    } else {
        console.error('could not find active party')
    }
};

const notifyPlayersOfGame = async (id: string, event: string, payload: any) => {
    const game: Game = await Redis.getItem(id);
    for (const player of game.player) {
        await notifyPlayer(player.id, game.partyId, event, payload);
    }
};

const notifyPlayersOfParty = async (id: string, event: string, payload: any) => {
    const party: Party = await Redis.getItem(id);
    for (const player of party.player) {
        await notifyPlayer(player.id, id, event, payload);
    }
};

export default {
    notifyPlayer,
    notifyPlayersOfGame,
    notifyPlayersOfParty
}