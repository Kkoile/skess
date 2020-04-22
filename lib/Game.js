const randomHash = require('random-hash');
const Redis = require("./Redis");
const ConfigService = require("./ConfigService");
const promisify = require('util').promisify;
const fs = require("fs");
const path = require('path');
const readFile = promisify(fs.readFile);
const io = require('socket.io-emitter')(ConfigService.getRedisConfiguration());

let wordList = {};

const getWordList = async (language) => {
    if (!wordList[language]) {
        const pathToFile = path.join(__dirname, '..', 'assets', `words_${language}.txt`);
        if (!fs.existsSync(pathToFile)) {
            throw new Error('Language does not exist')
        }
        const words = await readFile(pathToFile, 'utf8');
        wordList[language] = words.split('\r\n');
    }
    return wordList[language];
}

const createNewGame = async (host, previousGameId) => {
    let previousGame = null;
    if (previousGameId) {
        previousGame = await getGame(previousGameId)
        if (previousGame.nextGameId) {
            return previousGame.nextGameId;
        }
    }
    const gameIdentifier = randomHash.generateHash();
    await Redis.setItem(gameIdentifier, {id: gameIdentifier, host, player: [], options: previousGame ? previousGame.options : {language: 'en', timeToDraw: 60}});
    if (previousGame) {
        await Redis.setItem(previousGameId, {...previousGame, nextGameId: gameIdentifier});
    }
    return gameIdentifier;
};
const getGame = async (id, userId) => {
    const game = await Redis.getItem(id);
    if (userId && game && game.isRunning) {
        if (game.words) {
            game.currentRound = await getUserPayloadOfCurrentRound(game, userId)
            delete game.words
            delete game.wordsToChoose
        } else {
            game.wordsToChoose = game.wordsToChoose.find(words => words.playerId === userId);
        }
    }
    return game;
};

const notifyUsersOfGame = async (id, eventToSend, payload) => {
    io.to(id).emit(eventToSend, payload);
}

const notifyUser = async (userId, eventToSend, payload) => {
    const user = await Redis.getItem(userId);
    io.to(user.socketId).emit(eventToSend, payload);
}

const enterGame = async (id, userId) => {
    const game = await Redis.getItem(id);
    const user = await Redis.getItem(userId);
    if (game.player.includes((player) => player.id === userId)) {
        throw new Error('User already exists in game')
    }
    game.player = game.player.concat({...user, position: game.player.length});
    await Redis.setItem(id, game);
    user.activeGames = user.activeGames ? user.activeGames.concat(id) : user.activeGames = [id];
    await Redis.setItem(userId, user);
    await notifyUsersOfGame(id, 'playerEntered', {id: user.id, name: user.name});
    return game;
};

const leaveGame = async (id, userId) => {
    const game = await Redis.getItem(id);
    game.player = game.player.filter(player => player.id !== userId);
    await Redis.setItem(id, game);
    await notifyUsersOfGame(id, 'playerLeft', {id: userId});
};

const _getRandomWords = async (language, numberOfWords) => {
    const wordList = await getWordList(language)
    const words = []
    for (let i=0;i<numberOfWords;i++) {
        const index = Math.floor(Math.random()*wordList.length)
        words.push(wordList[index]);
    }
    return words
}

const _createWordsToChose = async (game) => {
    const WORDS_TO_CHOOSE_PER_USER = 3;
    const randomWords = await _getRandomWords(game.options.language, game.player.length * WORDS_TO_CHOOSE_PER_USER);
    return game.player.map((player, index) => {
        return {
            playerId: player.id,
            words: randomWords.slice(index * WORDS_TO_CHOOSE_PER_USER, index * WORDS_TO_CHOOSE_PER_USER + WORDS_TO_CHOOSE_PER_USER)
        }
    })
}

const _createRounds = async (game) => {
    const words = [];

    for (const player of game.player) {
        const rounds = [];
        const firstIndex = game.player.length % 2;
        let index = 0;
        for (let i=firstIndex; i<game.player.length; i++) {
            const nextPosition = (player.position + i) % game.player.length;
            rounds.push({
                player: game.player.find(otherPlayer => otherPlayer.position === nextPosition),
                guessing: index % 2 === 1,
                drawing: index % 2 === 0,
                image: null,
                guess: null
            })
            index++;
        }
        const word = game.wordsToChoose.find(word => word.playerId === player.id).chosenWord;
        words.push({word, player: player, rounds})
    }
    return words;
};

const start = async (id, options) => {
    const game = await Redis.getItem(id);
    if (game.isRunning) {
        throw new Error('Game is already started');
    }
    if (game.player.length < 2) {
        throw new Error('At least 2 people required to play this game');
    }
    game.options = {
        timeToDraw: options.timeToDraw,
        language: options.language
    }
    game.isRunning = true;
    game.wordsToChoose = await _createWordsToChose(game);
    game.currentRound = -1;
    await Redis.setItem(id, game);
    await notifyUsersOfGame(game.id, 'gameOptions', game.options);
    for (const player of game.player) {
        const words = game.wordsToChoose.find(words => words.playerId === player.id);
        await notifyUser(player.id, 'wordsToChoose', words);
    }
};

const chooseWord = async (id, userId, word) => {
    const game = await Redis.getItem(id);
    const playerWord = game.wordsToChoose.find(words => words.playerId === userId);
    playerWord.chosenWord = word;
    await Redis.setItem(id, game);
    if (game.wordsToChoose.every(words => !!words.chosenWord)) {
        game.words = await _createRounds(game);
        game.numberOfRounds = game.words[0].rounds.length;
        await Redis.setItem(game.id, game);
        await nextRound(game.id);
    }
};

const submitRound = async (id, userId, payload) => {
    const game = await Redis.getItem(id);
    if (!game.isRunning) {
        throw new Error('Game is not started');
    }
    const word = game.words.find(word => word.rounds[game.currentRound].player.id === userId);
    const round = word.rounds[game.currentRound];
    if (round.drawing) {
        round.image = payload.image;
    } else {
        round.guess = payload.guess;
    }
    round.submitted = true;
    await Redis.setItem(id, game);
    if (game.words.every(word => {
        return !!word.rounds[game.currentRound].submitted
    })){
        if (game.currentRound < game.numberOfRounds - 1) {
            await nextRound(id);
        } else {
            await endGame(id);
        }
    }
};

const getUserPayloadOfCurrentRound = async (game, userId) => {
    const word = game.words.find(word => word.rounds[game.currentRound].player.id === userId);
    const round = word.rounds[game.currentRound];
    const payload = {
        drawing: round.drawing,
        guessing: round.guessing
    };
    if (round.drawing) {
        if (game.currentRound === 0) {
            payload.word = word.word;
        } else {
            payload.word = word.rounds[game.currentRound - 1].guess;
        }
    } else {
        payload.image = word.rounds[game.currentRound - 1].image;
    }
    return payload
};

const nextRound = async (id) => {
    const game = await Redis.getItem(id);
    if (!game.isRunning) {
        throw new Error('Game is not started');
    }
    game.currentRound = game.currentRound + 1;
    await Redis.setItem(game.id, game);
    for (const player of game.player) {
        const payload = await getUserPayloadOfCurrentRound(game, player.id);
        await notifyUser(player.id, 'nextRound', payload);
    }
};

const endGame = async (id) => {
    const game = await Redis.getItem(id);
    game.finished = true;
    game.isRunning = false;
    await Redis.setItem(game.id, game);
    await notifyUsersOfGame(game.id, 'gameEnded', game);
}

module.exports = {
    createNewGame,
    getGame,
    enterGame,
    leaveGame,
    start,
    chooseWord,
    submitRound
};
