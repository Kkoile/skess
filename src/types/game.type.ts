import {Player} from "./player.type";

export type GameStatusType = 'CHOOSING_WORD' | 'RUNNING' | 'FINISHED'

export interface Round {
    playerId: string;
    image: string;
    guess: string;
    guessing: boolean;
    drawing: boolean;
    submitted: boolean;
    word: string;
    previousPlayerId: string;
    nextPlayerId: string;
}

export interface DrawingRound extends Round {
    drawing: true;
    guessing: false;
    word: string;
}

export interface GuessingRound extends Round {
    guessing: true;
    drawing: false;
    guess: string;
}

export interface RoundsPerWord {
    playerId: string;
    word: string;
    rounds: Array<Round>;
}

export interface GamePlayer extends Player{
    wordsToChose: Array<string>;
    chosenWord: string;
    position: number;
}

export interface Options {
    language: string;
    timeToDraw: number;
}

export type GameIdentifier = string;

export interface Game {
    id: GameIdentifier;
    partyId: string;
    player: Array<GamePlayer>;
    status: GameStatusType;
    allRounds: Array<RoundsPerWord>;
    numberOfRounds: number;
    currentRoundIndex: number;
    options: Options;
}