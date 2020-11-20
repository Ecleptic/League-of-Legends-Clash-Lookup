import readline from "readline";//const readline = require("readline");

import * as lists from "./DataLists.js";
import * as game from "./GameInfo.js";

// Setup console read
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


//rl.question("api key: ", key =>{lists.getQueueList()})

function getSummonerInfo(key) {
    apiGet('/lol/summoner/v4/summoners/by-name/The%20Crafty%20Corki', key);
}

let queueList = await lists.getQueueList();
console.log(queueList);

let queueInfo = await game.getQueue(700);
console.log(queueInfo);