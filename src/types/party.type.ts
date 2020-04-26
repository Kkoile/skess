import {Player} from "./player.type";
import {GameIdentifier, Options} from "./game.type";

export interface Party {
    id: string;
    hostId: string;
    player: Array<Player>
    games: Array<GameIdentifier>;
    activeGame: GameIdentifier;
    options: Options;
}