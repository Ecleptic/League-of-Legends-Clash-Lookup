import { urlGet, apiGet } from "./Request.js";
import * as account from "./AccountInfo.js";
import * as match from "./MatchInfo.js";

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

export async function getClashWinLoss(summonerName, key) {
    let allMatchData = await getClashMatches(summonerName, key);
    let matches = allMatchData.matches;
    for (let i = 0; i < matches.length; i++) {
        let curMatch = matches[i];

        let matchId = curMatch.gameId;
        let matchData = await match.getMatchInfo(matchId, key);
        let playerIndex = await match.getPlayerMatchIndex(matchData, summonerName);
        let teamIndex = await match.getPlayerTeamIndex(matchData, playerIndex);


        let winLoss = await match.getWinLoss(matchData, teamIndex);
        console.log(winLoss);
    }
}