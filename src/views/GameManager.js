import React, {useContext} from 'react';
import {GameContext} from "../contexts/GameContext";
import WordChooser from "./WordChooser";
import DrawingRound from "./DrawingRound";
import GuessingRound from "./GuessingRound";
import GameEndScreen from "./GameEndScreen";
import AlreadyGuessedView from "./AlreadyGuessedView";

export default function GameManager (props) {
    const {game} = useContext(GameContext);

    if (game.status === 'CHOOSING_WORD') {
        return <WordChooser {...props} />
    }
    if (game.status === 'RUNNING') {
        if (game.currentRound.drawing) {
            return <DrawingRound {...props} />
        }
        if (game.currentRound.guessing) {
            if (game.currentRound.guess) {
                return <AlreadyGuessedView {...props} />
            }
            return <GuessingRound {...props} />
        }
    }

    if (game.status === 'FINISHED') {
        return <GameEndScreen {...props} />
    }

    return <div>Hallo</div>

}