import Redis from "./Redis";
import * as randomHash from 'random-hash';
import {Party} from "../types/party.type";
import {Player} from "../types/player.type";
import Notifier from "./Notifier";


const createUser = async (data) => {
    const user: Player = {id: data.id, name: data.name, activeParties: []};
    await Redis.setItem(user.id, user);
    return user;
};

export default {
    createUser
}