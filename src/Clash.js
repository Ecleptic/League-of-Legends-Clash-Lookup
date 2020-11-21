import { urlGet, apiGet } from "./Request.js";
import * as account from "./AccountInfo.js";
import * as match from "./MatchInfo.js";
import * as game from "./GameInfo.js";
import * as lists from "./DataLists.js";

export async function getClashMatches(summonerName, key) {
    let accountId = await account.getAccountId(summonerName, key);
    let data = await urlGet('https://na1.api.riotgames.com/lol/match/v4/matchlists/by-account/' + accountId + '?queue=700&api_key=' + key);
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

    // Print out string of dots for progress comparison
    console.log(".".repeat(matches.length));

    // Get champ list up front
    let champList = await lists.getChampionList();

    for (let i = 0; i < matches.length; i++) {
        let curMatch = matches[i];

        let matchId = curMatch.gameId;
        let matchData = await match.getMatchInfo(matchId, key);
        let playerIndex = match.getPlayerMatchIndex(matchData, summonerName);

        // Skip if player is not found
        if (playerIndex < 0) {
            continue;
        }

        let teamIndex = match.getPlayerTeamIndex(matchData, playerIndex);
        let champId = matchData.participants[playerIndex].championId;

        let winLoss = match.getWinLoss(matchData, teamIndex);
        let champName = game.getChampionNameFromList(champList, champId);
        process.stdout.write(".");
        //console.log(winLoss, champName);

        // Initialize champ data if it doesn't already exist
        if (winrateObj[champName] == undefined) {
            winrateObj[champName] = {};
            winrateObj[champName].wins = 0;
            winrateObj[champName].losses = 0;
        }

        // Add win/loss data
        if (winLoss == "Win") {
            winrateObj[champName].wins++;
            totalWins++;
        }
        else {
            winrateObj[champName].losses++;
            totalLosses++;
        }

        // End of loop, print winrate object
        if (i == matches.length - 1) {
            console.log(winrateObj);
            console.log(totalWins, totalLosses);
        }
    }
}