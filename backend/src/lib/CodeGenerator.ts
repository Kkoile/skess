import * as path from "path";
import * as fs from 'fs';
import {promisify} from 'util';
const readFile = promisify(fs.readFile);

let wordList = {};

const getWordList = async (language) => {
    if (!wordList[language]) {
        const pathToFile = path.join(__dirname, '..', '..', 'assets', `words_${language}.txt`);
        if (!fs.existsSync(pathToFile)) {
            throw new Error('Language does not exist')
        }
        const words = await readFile(pathToFile, 'utf8');
        wordList[language] = words.split('\n');
    }
    return wordList[language];
};

const getRandomWords = async (language: string, numberOfWords: number, maxLength?: number) => {
    const wordList = await getWordList(language);
    const words = [];
    while (words.length < numberOfWords) {
        const index = Math.floor(Math.random() * wordList.length);
        const word = wordList[index];
        if (!maxLength || word.length <= maxLength) {
            words.push(word);
        }
    }
    return words
};

const generateCode = async (language = 'en') => {
    const words = await getRandomWords(language, 2, 5);
    return words.join('-');
}

export default {
    getRandomWords,
    generateCode
}