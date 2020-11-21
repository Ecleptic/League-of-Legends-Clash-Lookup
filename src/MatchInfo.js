import { urlGet, apiGet } from "./Request.js";
import * as account from "./AccountInfo.js";

export async function getMatchInfo(matchId, key) {
    let data = await apiGet('/lol/match/v4/matches/' + matchId, key);
    if (data) {
        return data;
    }
    else {
        return {};
    }
}

export async function getPlayerMatchIndex(matchData, summonerName) {
    let participantInfo = matchData.participantIdentities;
    for (let i = 0; i < participantInfo.length; i++) {
        let playerData = participantInfo[i];
        if (playerData.player.summonerName == summonerName) {
            return i;
        }
        else if (i == participantInfo.length - 1) {
            return -1;
        }
    }
}

export async function getPlayerMatchInfo(matchData, summonerName) {
    let playerIndex = await getPlayerMatchIndex(matchData, summonerName);
    return matchData.participants[playerIndex];
}