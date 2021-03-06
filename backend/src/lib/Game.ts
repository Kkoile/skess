import Redis from "./Redis";
import {EndScreenState, Game, GamePlayer, Round, RoundsPerWord} from "../types/game.type";
import {Party} from "../types/party.type";
import Notifier from "./Notifier";
import CodeGenerator from "./CodeGenerator";
import PartyHandler from "./Party";
import * as Redlock from 'redlock';

const redlock = new Redlock([Redis.getClient()]);

const createNewGame = async (partyId) => {
    const party: Party = await Redis.getItem(partyId.toLowerCase());
    const id = await CodeGenerator.generateCode(party.options.language);
    const NUMBER_OF_WORDS_PER_PLAYER = 3;
    const randomWords = await CodeGenerator.getRandomWords(party.options.language, party.player.length * NUMBER_OF_WORDS_PER_PLAYER);
    const playerWithWordsToChoose: Array<GamePlayer> = party.player.map((player, i) => {
        return {...player, position: i, wordsToChose: randomWords.slice(i * NUMBER_OF_WORDS_PER_PLAYER, i * NUMBER_OF_WORDS_PER_PLAYER + NUMBER_OF_WORDS_PER_PLAYER), chosenWord: null}
    });
    const game: Game = {id, partyId: partyId.toLowerCase(), player: playerWithWordsToChoose, status: 'CHOOSING_WORD', options: party.options, allRounds: [], numberOfRounds: -1, currentRoundIndex: -1, endScreenState: {playerId: playerWithWordsToChoose[0].id, roundIndex: 0, isGuessShowing: false}}
    await Redis.setItem(game.id, game);
    await sendUsersNewGameState(game);
    return game.id;
};

const sendUsersNewGameState = async (game: Game) => {
    for (const player of game.player) {
        const payload = await transformUsersPayload(game, player.id);
        await Notifier.notifyPlayer(player.id, game.partyId, 'newGameState', payload);
    }
};

const transformUsersPayload = async (game: Game, playerId: string) => {
    const {player, allRounds, ...rest} = game;
    const payload = {
        ...rest,
        player: undefined,
        allRounds: undefined,
        currentRound: undefined,
        wordsToChoose: undefined,
        chosenWord: undefined,
        waitingForPlayerToSubmit: []
    }
    payload.player = player.map(user => {
        const playerPayload = {id: user.id, name: user.name};
        return playerPayload;
    });
    if (game.status === 'FINISHED') {
        payload.allRounds = allRounds;
    } else if (game.status === 'CHOOSING_WORD') {
        const playerInfo = player.find(user => user.id === playerId);
        payload.wordsToChoose = playerInfo.wordsToChose;
        payload.chosenWord = playerInfo.chosenWord;
        payload.waitingForPlayerToSubmit = game.player.filter(player => !player.chosenWord).map(player => player.id);

    } else if (game.status === 'RUNNING') {
        const round = game.allRounds.find(roundPerWord => {
            return roundPerWord.rounds[game.currentRoundIndex].playerId === playerId;
        });
        payload.currentRound = round.rounds[game.currentRoundIndex];
        if (payload.currentRound.drawing && game.currentRoundIndex > 0) {
            payload.currentRound.word = round.rounds[game.currentRoundIndex - 1].guess;
        }
        if (payload.currentRound.guessing) {
            payload.currentRound.image = round.rounds[game.currentRoundIndex - 1].image;
        }
        payload.waitingForPlayerToSubmit = game.allRounds.filter(roundPerWord => {
            return !roundPerWord.rounds[game.currentRoundIndex].submitted
        }).map(roundPerWord => roundPerWord.rounds[game.currentRoundIndex].playerId);
    }
    return payload;
};

const chooseWord = async (gameId: string, playerId: string, word: string) => {
    const lock = await redlock.lock(`locks:${gameId.toLowerCase()}`, 1000);
    const game = await Redis.getItem(gameId.toLowerCase());
    const player: GamePlayer = game.player.find(player => player.id === playerId);
    player.chosenWord = word;
    await Redis.setItem(game.id, game);
    const allPlayersHaveChosen = game.player.every(player => !!player.chosenWord);
    await lock.unlock();
    await sendUsersNewGameState(game);
    if (allPlayersHaveChosen) {
        await _startGame(game);
    }
};

const _startGame = async (game: Game) => {
    game.allRounds = await _createRounds(game);
    game.numberOfRounds = game.allRounds[0].rounds.length;
    game.status = 'RUNNING';
    game.currentRoundIndex = 0;
    await Redis.setItem(game.id, game);
    await sendUsersNewGameState(game);
}

const nextRound = async (game: Game) => {
    game.currentRoundIndex = game.currentRoundIndex + 1;
    await Redis.setItem(game.id, game);

    await sendUsersNewGameState(game);
};

const getGame = async (id: string, userId: string) => {
    const game = await Redis.getItem(id.toLowerCase());
    if (!game) {
        return;
    }
    if (!game.player.find(player => player.id === userId)) {
        throw new Error('NOT_PART_OF_GAME');
    }
    return await transformUsersPayload(game, userId);
};

const _createRounds = (game: Game) : Array<RoundsPerWord> => {
    const roundsPerWords :Array<RoundsPerWord> = [];

    const firstIndex = game.player.length % 2;
    for (const player of game.player) {
        let index = 0;
        const rounds: Array<Round> = [];
        for (let i=firstIndex; i<game.player.length; i++) {
            const nextPosition = (player.position + i) % game.player.length;
            const round: Round = {
                playerId: game.player.find(otherPlayer => otherPlayer.position === nextPosition).id,
                guessing: index % 2 === 1,
                drawing: index % 2 === 0,
                image: undefined,
                guess: undefined,
                word: undefined,
                submitted: false,
                previousPlayerId: undefined,
                nextPlayerId: undefined
            };
            if (index === 0) {
                round.word = player.chosenWord;
            }
            if (index > 0) {
                round.previousPlayerId = rounds[index - 1].playerId;
                rounds[index - 1].nextPlayerId = round.playerId;
            }
            rounds.push(round);
            index++;
        }
        const word = player.chosenWord;
        roundsPerWords.push({word, playerId: player.id, rounds})
    }
    return roundsPerWords;
};

const submitRound = async (gameId: string, userId: string, payload) => {
    const lock = await redlock.lock(`locks:${gameId.toLowerCase()}`, 1000);
    const game = await Redis.getItem(gameId.toLowerCase());
    const roundPerWord = game.allRounds.find(roundsPerWord => roundsPerWord.rounds[game.currentRoundIndex].playerId === userId);
    const round: Round = roundPerWord.rounds[game.currentRoundIndex];
    if (round.drawing) {
        round.image = payload.image;
    } else {
        round.guess = payload.guess;
    }
    round.submitted = true;
    await Redis.setItem(game.id, game);
    const isLastPlayerToSubmit = game.allRounds.every(roundsPerWord => {
        return !!roundsPerWord.rounds[game.currentRoundIndex].submitted
    });
    await lock.unlock();
    if (round.guessing) {
        await sendUsersNewGameState(game);
    }
    if (isLastPlayerToSubmit){
        if (game.currentRoundIndex < game.numberOfRounds - 1) {
            await nextRound(game);
        } else {
            await endGame(game);
        }
    }
};

const endGame = async (game) => {
    game.status = 'FINISHED';
    await Redis.setItem(game.id, game);
    await sendUsersNewGameState(game);
    await PartyHandler.endGame(game.partyId);
};

const updateEndScreenState = async (id: string, endScreenState: EndScreenState) => {
    const game: Game = await Redis.getItem(id.toLowerCase());
    game.endScreenState = endScreenState;
    await Redis.setItem(game.id, game);
    await sendUsersNewGameState(game);
};

export default {
    createNewGame,
    getGame,
    chooseWord,
    submitRound,
    updateEndScreenState
};
