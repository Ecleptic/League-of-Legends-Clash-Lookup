import { urlGet, apiGet } from "./Request.js";
import * as account from "./AccountInfo.js";
import * as match from "./MatchInfo.js";
import * as game from "./GameInfo.js";

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
        let playerIndex = await match.getPlayerMatchIndex(matchData, summonerName);
        let teamIndex = await match.getPlayerTeamIndex(matchData, playerIndex);

        let champId = matchData.participants[playerIndex].championId;

        let winLoss = await match.getWinLoss(matchData, teamIndex);
        let champName = await game.getChampionName(champId);
        console.log(champName, winLoss);
    }
}