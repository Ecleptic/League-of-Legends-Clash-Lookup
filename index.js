import readline from "readline";
import dotenv from "dotenv";
dotenv.config();

import * as lists from "./src/DataLists.js";
import * as game from "./src/GameInfo.js";
import * as account from "./src/AccountInfo.js";
import * as clash from "./src/Clash.js";
import * as match from "./src/MatchInfo.js";

// Setup console read
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Get key from environment variable
const apiKey = process.env.API_KEY;

let queueList = await lists.getQueueList();
//console.log(queueList);

let queueInfo = await game.getQueue(700);
//console.log(queueInfo);

// rl.question("api key: ", (key) => {
//     playerMatchInfo(key);
// });

playerMatchInfo(apiKey);

async function matchHistory(key) {
    let matchHistory = await account.getMatchHistory("The Crafty Corki", key);
    console.log(matchHistory);
}

async function clashMatchHistory(key) {
    let matchHistory = await clash.getClashMatches("The Crafty Corki", key);
    console.log(matchHistory);
}

async function matchInfo(key) {
    let matchData = await match.getMatchInfo(3228438067, key);
    console.log(matchData);
}

async function playerMatchInfo(key) {
    let matchData = await match.getMatchInfo(3228438067, key);
    let playerData = await match.getPlayerMatchInfo(matchData, "The Crafty Corki");
    console.log(playerData);
}