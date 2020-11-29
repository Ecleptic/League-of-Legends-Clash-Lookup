import { Request } from "./Request.js";
import * as account from "./AccountInfo.js";
import { Match, getMatchData } from "./MatchInfo.js";
import * as game from "./GameInfo.js";
import * as lists from "./DataLists.js";

export async function getClashMatches(summonerName, key) {
    let accountId = await account.getAccountId(summonerName, key);
    let data = await Request.urlGet('https://na1.api.riotgames.com/lol/match/v4/matchlists/by-account/' + accountId + '?queue=700&api_key=' + key);
    if (data) {
        return data;
    }
    else {
        return [];
    }
}

export async function printClashData(summonerName, key) {
    let allMatchData = await getClashMatches(summonerName, key);
    let matches = allMatchData.matches;
    if (matches == undefined) {
        console.log("Error: matches are undefined");
        return;
    }

    for (let i = 0; i < matches.length; i++) {
        let curMatch = matches[i];

        let matchId = curMatch.gameId;
        let matchData = await match.getMatchInfo(matchId, key);
        let playerIndex = match.getPlayerMatchIndex(matchData, summonerName);
        let teamIndex = match.getPlayerTeamIndex(matchData, playerIndex);

        let champId = matchData.participants[playerIndex].championId;

        let winLoss = match.getWinLoss(matchData, teamIndex);
        let champName = await game.getChampionName(champId);
        console.log(champName, winLoss);
    }
}

export async function getClashWinrates(summonerName, key) {
    let allMatchData = await getClashMatches(summonerName, key);
    let matches = allMatchData.matches;
    if (matches == undefined) {
        console.log("Error: matches are undefined");
        return;
    }

    let winrateObj = {};
    let totalWins = 0;
    let totalLosses = 0;
    let theirBans = {};
    let ourBans = {};

    // Print out string of dots for progress comparison
    console.log(".".repeat(matches.length));

    for (let i = 0; i < matches.length; i++) {
        let matchData = await getMatchData(matches[i].gameId, key);

        let match = new Match(matchData);

        let champName = await match.getChampionName(summonerName);
        let allyBanList = await match.getAllyBans(summonerName);
        let enemyBanList = await match.getEnemyBans(summonerName);
        let result = match.getResult(summonerName);
        process.stdout.write(".");

        // Initialize data if it doesn't already exist
        // Champs
        if (winrateObj[champName] == undefined) {
            winrateObj[champName] = {};
            winrateObj[champName].wins = 0;
            winrateObj[champName].losses = 0;
        }

        // Their bans
        for (let i = 0; i < enemyBanList.length; i++) {
            let enemyBanChamp = enemyBanList[i];

            if (theirBans[enemyBanChamp] == undefined) {
                theirBans[enemyBanChamp] = {};
                theirBans[enemyBanChamp].wins = 0;
                theirBans[enemyBanChamp].losses = 0;
            }
        }
        // Our bans
        for (let i = 0; i < allyBanList.length; i++) {
            let allyBanChamp = allyBanList[i];

            if (ourBans[allyBanChamp] == undefined) {
                ourBans[allyBanChamp] = {};
                ourBans[allyBanChamp].wins = 0;
                ourBans[allyBanChamp].losses = 0;
            }
        }

        // Add win/loss data
        if (result == "Win") {
            winrateObj[champName].wins++;
            totalWins++;

            // Ally bans
            for (let i = 0; i < allyBanList.length; i++) {
                let allyBanChamp = allyBanList[i];
                ourBans[allyBanChamp].wins++;
            }

            // Enemy bans
            for (let i = 0; i < enemyBanList.length; i++) {
                let enemyBanChamp = enemyBanList[i];
                theirBans[enemyBanChamp].wins++;
            }
        }
        // Losses
        else {
            winrateObj[champName].losses++;
            totalLosses++;

            // Ally Bans
            for (let i = 0; i < allyBanList.length; i++) {
                let allyBanChamp = allyBanList[i];
                ourBans[allyBanChamp].losses++;
            }

            // Enemy bans
            for (let i = 0; i < enemyBanList.length; i++) {
                let enemyBanChamp = enemyBanList[i];
                theirBans[enemyBanChamp].losses++;
            }
        }

        // End of loop, print winrate object
        if (i == matches.length - 1) {
            // Put data in arrays and sort data from most - least
            // Champion picks
            let winrateArr = [];
            for (let curChampName in winrateObj) {
                winrateObj[curChampName].name = curChampName;
                winrateArr.push(winrateObj[curChampName]);
            }
            winrateArr.sort((a, b) => {
                return (b.wins+b.losses) - (a.wins+a.losses);
            });

            // Ally bans
            let allyBanArr = [];
            for (let curChampName in ourBans) {
                ourBans[curChampName].name = curChampName;
                allyBanArr.push(ourBans[curChampName]);
            }
            allyBanArr.sort((a, b) => {
                return (b.wins+b.losses) - (a.wins+a.losses);
            });

            // Enemy bans
            let enemyBanArr = [];
            for (let curChampName in theirBans) {
                theirBans[curChampName].name = curChampName;
                enemyBanArr.push(theirBans[curChampName]);
            }
            enemyBanArr.sort((a, b) => {
                return (b.wins+b.losses) - (a.wins+a.losses);
            });

            console.log("\n", summonerName);
            console.log(totalWins, totalLosses);

            console.log("\nChampion picks");
            console.log(winrateArr);

            console.log("\nAlly team bans");
            console.log(allyBanArr);

            console.log("\nEnemy team bans")
            console.log(enemyBanArr);
        }
    }
}