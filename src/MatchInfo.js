import { Request } from "./Request.js";
import * as account from "./AccountInfo.js";
import * as game from "./GameInfo.js";
import * as lists from "./DataLists.js";

// Constructors cannot be async so separate into a global function
export async function getMatchData(matchId, key) {
    let data = await Request.apiGet('/lol/match/v4/matches/' + matchId, key);
    if (data) {
        return data;
    }
    else {
        console.log("Error (getMatchData): invalid match data received", data);
        return {};
    }
}

export class Match {
    matchData = undefined;
    invalid = false;

    constructor(matchData) {
        if (matchData) {
            this.matchData = matchData;
        }
        else {
            invalid = true;
        }
    }

    // Player data
    async getChampionName(summonerName) {
        if (this.invalid) {return "";}

        let champList = await lists.getChampionList();
        let playerIndex = this.getPlayerIndex(summonerName);
        let champId = this.matchData.participants[playerIndex].championId;

        return game.getChampionNameFromList(champList, champId);
    }

    // Team data
    getResult(summonerName) {
        if (this.invalid) {return "";}

        let playerIndex = this.getPlayerIndex(summonerName);
        let teamIndex = this.getTeamIndex(playerIndex);
        return this.matchData.teams[teamIndex].win;
    }

    async getAllyBans(summonerName) {
        if (this.invalid) {return [];}

        let playerIndex = this.getPlayerIndex(summonerName);
        let teamIndex = this.getTeamIndex(playerIndex);
        let allyBans = this.matchData.teams[teamIndex].bans;

        // Get champ namesfrom ids
        let output = [];
        let champList = await lists.getChampionList();
        allyBans.forEach(banData => {
            let champId = banData.championId;
            output.push(game.getChampionNameFromList(champList, champId));
        });
        return output;
    }

    async getEnemyBans(summonerName) {
        if (this.invalid) {return [];}

        let playerIndex = this.getPlayerIndex(summonerName);
        let teamIndex = this.getTeamIndex(playerIndex);
        // Flip index to get enemy team
        teamIndex = 1 - teamIndex;
        let enemyBans = this.matchData.teams[teamIndex].bans;

        // Get champ namesfrom ids
        let output = [];
        let champList = await lists.getChampionList();
        enemyBans.forEach(banData => {
            let champId = banData.championId;
            output.push(game.getChampionNameFromList(champList, champId));
        });
        return output;
    }

    // Helper functions
    getPlayerIndex(summonerName) {
        if (this.invalid) {return -1;}

        let participantInfo = this.matchData.participantIdentities;
        for (let i = 0; i < participantInfo.length; i++) {
            let playerData = participantInfo[i];
            if (playerData.player.summonerName == summonerName) {
                return i;
            }
            else if (i == participantInfo.length - 1) {
                console.log("Error (Match::getPlayerIndex): Player not found");
                return -1;
            }
        }
    }

    getTeamIndex(playerIndex) {
        if (this.invalid) {return -1;}

        let teamId = this.matchData.participants[playerIndex].teamId;
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
}