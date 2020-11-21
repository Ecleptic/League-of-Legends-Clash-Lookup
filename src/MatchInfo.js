import { Request } from "./Request.js";
import * as account from "./AccountInfo.js";

export function getWinLoss(matchData, teamIndex) {
    let teamData = matchData.teams[teamIndex];
    return teamData.win;
}

export async function getMatchInfo(matchId, key) {
    let data = await Request.apiGet('/lol/match/v4/matches/' + matchId, key);
    if (data) {
        return data;
    }
    else {
        console.log("Error (getMatchInfo): invalid match data received", data);
        return {};
    }
}

export function getPlayerMatchIndex(matchData, summonerName) {
    let participantInfo = matchData.participantIdentities;
    if (!participantInfo) {
        console.log("Error (getPlayerMatchIndex): couldn't get participant info from match data:", matchData);
        return -1;
    }
    for (let i = 0; i < participantInfo.length; i++) {
        let playerData = participantInfo[i];
        if (playerData.player.summonerName == summonerName) {
            return i;
        }
        else if (i == participantInfo.length - 1) {
            console.log("Error (getPlayerMatchIndex): Player not found");
            return -1;
        }
    }
}

export function getPlayerTeamIndex(matchData, playerIndex) {
    if (playerIndex < 0) {
        return -1;
    }

    let teamId = matchData.participants[playerIndex].teamId;
    if (teamId == "100") {
        return 0;
    }
    else if (teamId == "200") {
        return 1;
    }
    else {
        console.log("Error (getPlayerTeamIndex): team id isn't 100 or 200", teamId);
        return -1;
    }
}

export function getPlayerMatchInfo(matchData, summonerName) {
    let playerIndex = getPlayerMatchIndex(matchData, summonerName);
    if (playerIndex >= 0) {
        return matchData.participants[playerIndex];
    }
    else {
        return {};
    }
}

export async function getTeamMatchInfo(matchData, summonerName) {
    let teamIndex = await getPlayerTeamIndex(matchData, summonerName);
    if (teamIndex > 0) {
        return matchData.participants[playerIndex];
    }
    else {
        return {};
    }
    
}