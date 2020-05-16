import * as Queue from 'bull';
import ConfigService from "./ConfigService";
import Game from "./Game";

const redisConfiguration = ConfigService.getRedisConfiguration();
const submitRoundQueue = new Queue('submitRound', {redis: redisConfiguration})
const chooseWordQueue = new Queue('chooseWord', {redis: redisConfiguration})

submitRoundQueue.process(async (job) => {
    const {gameId, userId, payload} = job.data;
    return await Game.submitRound(gameId, userId, payload)
})

chooseWordQueue.process(async (job) => {
    const {gameId, userId, word} = job.data;
    return await Game.chooseWord(gameId, userId, word);
})

const addToSubmitQueue = (gameId, userId, payload) => {
    submitRoundQueue.add({gameId, userId, payload}, {attempts: 100});
};

const addToChooseWordQueue = (gameId, userId, word) => {
    chooseWordQueue.add({gameId, userId, word}, {attempts: 100});
};

export default {
    addToChooseWordQueue,
    addToSubmitQueue
};