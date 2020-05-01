import Redis from "./Redis";
import {Player} from "../types/player.type";
import Party from "./Party";


const createUser = async (data) => {
    let user: Player = await Redis.getItem(data.id);
    if (!user) {
        user = {id: data.id, name: data.name, activeParties: []};
    }
    user.name = data.name;
    await Redis.setItem(user.id, user);

    await Party.updateUser(user);

    return user;
};

export default {
    createUser
}