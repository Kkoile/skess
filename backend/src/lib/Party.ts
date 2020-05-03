import Redis from "./Redis";
import {Party} from "../types/party.type";
import {Player} from "../types/player.type";
import Notifier from "./Notifier";
import Game from "./Game";
import CodeGenerator from "./CodeGenerator";


const createNewParty = async (userId) => {
    const id = await CodeGenerator.generateCode('en');
    const party: Party = {id, hostId: userId, player: [], games: [], activeGame: null, options: {language: 'en', timeToDraw: 60}};
    await Redis.setItem(party.id, party);
    return party;
};

const createNewGame = async (partyId) => {
    const gameId = await Game.createNewGame(partyId.toLowerCase());
    const party: Party = await Redis.getItem(partyId.toLowerCase());
    party.activeGame = gameId;
    party.games.push(gameId);
    await Redis.setItem(party.id, party);
    await sendNewPartyState(party);
    await Notifier.notifyPlayersOfParty(party.id, 'GAME_STARTED', gameId);
    return gameId;
};

const endGame = async (partyId) => {
    const party: Party = await Redis.getItem(partyId.toLowerCase());
    party.activeGame = null;
    await Redis.setItem(party.id, party);
    await sendNewPartyState(party);
};

const getParty = async (partyId) => {
    const party: Party = await Redis.getItem(partyId.toLowerCase());
    if (!party) {
        return null;
    }
    return transformToPayload(party);
};

const transformToPayload = (party: Party) => {
    party.player = party.player.map(player => {
        const {id, name, ...rest} = player
        return {id, name};
    });
    party.games = party.games.reverse();
    return party;
}

const sendNewPartyState = async (party: Party) => {
    const payload = transformToPayload(party);
    await Notifier.notifyPlayersOfParty(party.id, 'partyStateChanged', payload);
}

const enterParty = async (partyId, userId) => {
    const party: Party = await Redis.getItem(partyId.toLowerCase());
    const user: Player = await Redis.getItem(userId);
    if (!party.player.find(player => player.id === user.id)) {
        party.player.push(user);
        await Redis.setItem(party.id, party);
    }
    await sendNewPartyState(party);
};

const leaveParty = async (partyId: string, userId: string) => {
    const party: Party = await Redis.getItem(partyId.toLowerCase());
    party.player = party.player.filter(player => player.id !== userId);
    await Redis.setItem(party.id, party);
    await sendNewPartyState(party);
};

const updateOptions = async (partyId, options) => {
    const party: Party = await Redis.getItem(partyId.toLowerCase());
    party.options = options;
    await Redis.setItem(party.id, party);
    await sendNewPartyState(party);
};

const updateUser = async (user: Player) => {
    for (const partyId of user.activeParties) {
        const party: Party = await Redis.getItem(partyId);
        const partyUser = party.player.find(player => player.id === user.id);
        if (partyUser) {
            partyUser.name = user.name;
            await Redis.setItem(party.id, party);
            await sendNewPartyState(party);
        }
    }
};

export default {
    createNewParty,
    createNewGame,
    endGame,
    getParty,
    enterParty,
    leaveParty,
    updateOptions,
    updateUser
}