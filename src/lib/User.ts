import Redis from "./Redis";
import {Player} from "../types/player.type";


const createUser = async (data) => {
    const user: Player = {id: data.id, name: data.name, activeParties: []};
    await Redis.setItem(user.id, user);
    return user;
};

export default {
    createUser
}