import { Request } from "./Request.js";
import * as game from "./GameInfo.js";
import * as lists from "./DataLists.js";
import { getAccountId } from "./AccountInfo.js";

export class Match {
    matchData = undefined;
    invalid = true;
    key = ""

    // Setup data for current match
    async init(matchId, key) {
        this.matchData = await Request.apiGet('/lol/match/v4/matches/' + matchId, key);
        if (this.matchData.error) {
            this.invalid = true;
            return this.matchData;
        }
        else {
            this.invalid = false;
            this.key = key;
            return {};
        }
    }

    // Player data
    async getChampionName(summonerName) {
        if (this.invalid) {return "";}

        let champList = await lists.getChampionList();
        let playerIndex = await this.getPlayerIndex(summonerName);

        // Check for errors
        if (playerIndex < 0) {
            return "";
        }

        let champId = this.matchData.participants[playerIndex].championId;
        return game.getChampionNameFromList(champList, champId);
    }

    async getRole(summonerName) {
        if (this.invalid) {return "";}

        let playerIndex = await this.getPlayerIndex(summonerName);

        // Check for errors
        if (playerIndex < 0) {
            return "";
        }

        let role = this.matchData.participants[playerIndex].timeline.role;
        let lane = this.matchData.participants[playerIndex].timeline.lane;
        if (lane != "BOTTOM") {
            if (role.includes("DUO")) {
                return "unsure";
            }
            else {
                return lane.toLowerCase();
            }
        }
        // Bot lane is a special case as a duo lane
        else {
            if (role == "DUO_SUPPORT") {
                return "support";
            }
            else {
                return "bottom";
            }
        }
    }

    // Team data
    async getResult(summonerName) {
        if (this.invalid) {return "";}

        let playerIndex = await this.getPlayerIndex(summonerName);
        
        // Check errors
        if (playerIndex < 0) {
            return "";
        }

        let teamIndex = this.getTeamIndex(playerIndex);
        return this.matchData.teams[teamIndex].win;
    }

    async getAllyBans(summonerName) {
        if (this.invalid) {return [];}

        let playerIndex = await this.getPlayerIndex(summonerName);

        // Check errors
        if (playerIndex < 0) {
            return [];
        }

        let teamIndex = this.getTeamIndex(playerIndex);
        let allyBans = this.matchData.teams[teamIndex].bans;

        // Get champ names from ids
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

        let playerIndex = await this.getPlayerIndex(summonerName);

        // Check errors
        if (playerIndex < 0) {
            return [];
        }

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
    async getPlayerIndex(summonerName) {
        if (this.invalid) {return -1;}

        // Convert to account ID (otherwise name changes/locale can mess it up)
        const accountId = await getAccountId(summonerName, this.key);
        if (accountId.error) {
            console.log(accountId.errorMessage);
            return -1;
        }

        let participantInfo = this.matchData.participantIdentities;
        for (let i = 0; i < participantInfo.length; i++) {
            let playerData = participantInfo[i];
            const curId = playerData.player.accountId;

            if (accountId == curId) {
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