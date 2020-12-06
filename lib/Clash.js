import { Request } from "./Request.js";
import * as account from "./AccountInfo.js";
import { Match } from "./MatchInfo.js";

// Process all clash related data for one player
export class Clash {
    summonerName = "";
    key = "";

    matches;
    champWinrates = {};
    roleWinrates = {
        top: {
            wins: 0,
            losses: 0,
        },
        jungle: {
            wins: 0,
            losses: 0,
        },
        middle: {
            wins: 0,
            losses: 0,
        },
        bottom: {
            wins: 0,
            losses: 0,
        },
        support: {
            wins: 0,
            losses: 0,
        },
        unsure: {
            wins: 0,
            losses: 0,
        },
        none: {
            wins: 0,
            losses: 0,
        },
    };
    totals = {
        wins: 0,
        losses: 0,
    }
    allyBans = {};
    enemyBans = {};

    async getClashMatches(summonerName, key) {
        // Get account ID from username
        let data = await account.getAccountId(summonerName, key);
        if (data.error) {
            return data;
        }

        // Get list of matches
        return await Request.urlGet('https://na1.api.riotgames.com/lol/match/v4/matchlists/by-account/' + data + '?queue=700&api_key=' + key);
    }

    async run(summonerName, key) {
        let allMatchData = await this.getClashMatches(summonerName, key);
        if (allMatchData.error) {
            console.log(allMatchData.errorMessage);
            return allMatchData;
        }
        let matches = allMatchData.matches;
    
        // Print out string of dots for progress comparison
        console.log(".".repeat(matches.length));
    
        for (let i = 0; i < matches.length; i++) {
            // Initialize match data
            let match = new Match;
            const data = await match.init(matches[i].gameId, key);

            // Check errors
            if (data.error) {
                console.log(data.errorMessage);
                return data;
            }
    
            // Get data from current match
            let champName = await match.getChampionName(summonerName);
            let allyBanList = await match.getAllyBans(summonerName);
            let enemyBanList = await match.getEnemyBans(summonerName);
            let role = await match.getRole(summonerName);
            let result = await match.getResult(summonerName);

            // Print for progress bar
            process.stdout.write(".");
    
            // Initialize data if it doesn't already exist
            this.initWinrateData(this.champWinrates, champName);

            // Enemy bans
            for (let i = 0; i < enemyBanList.length; i++) {
                let enemyBanChamp = enemyBanList[i];
                this.initWinrateData(this.enemyBans, enemyBanChamp);
            }
            // Ally Bans
            for (let i = 0; i < allyBanList.length; i++) {
                let allyBanChamp = allyBanList[i];
                this.initWinrateData(this.allyBans, allyBanChamp);
            }
    
            // Add win/loss data
            this.addResult(result, champName, role, allyBanList, enemyBanList);
    
            // End of loop, print winrate object
            if (i == matches.length - 1) {
                // Sort data from most - least
                // And convert from W/L to # Games/Winrate
                this.convertWinrates(this.totals);
                let champArr = this.sortWinrates(this.champWinrates);
                let roleArr = this.sortWinrates(this.roleWinrates);
                let allyBanArr = this.sortWinrates(this.allyBans);
                let enemyBanArr = this.sortWinrates(this.enemyBans);
    
                console.log("\n", summonerName);
                console.log(this.totals);
    
                // console.log("\nChampion picks");
                // console.log(winrateArr);

                // console.log("\nRoles");
                // console.log(this.roleWinrates);
    
                // console.log("\nAlly team bans");
                // console.log(allyBanArr);
    
                // console.log("\nEnemy team bans")
                // console.log(enemyBanArr);

                return {totals:this.totals, champArr, roleArr, allyBanArr, enemyBanArr};
                
            }
        }
    }

    initWinrateData(winrateObj, varName) {
        if (winrateObj[varName] == undefined) {
            winrateObj[varName] = {};
            winrateObj[varName].wins = 0;
            winrateObj[varName].losses = 0;
        }
    }

    addResult(result, champName, role, allyBanList, enemyBanList) {
        let resultKey = "";
        if (result == "Win") {
            resultKey = "wins";
        }
        else {
            resultKey = "losses";
        }

        // Total results
        this.champWinrates[champName][resultKey]++;
        this.totals[resultKey]++;
        if (this.roleWinrates[role] == undefined) {
            console.log("role winrates: ", this.roleWinrates, "role", role);
        }
        else {
            this.roleWinrates[role][resultKey]++;
        }
        
        // Ally bans
        for (let i = 0; i < allyBanList.length; i++) {
            let allyBanChamp = allyBanList[i];
            this.allyBans[allyBanChamp][resultKey]++;
        }

        // Enemy bans
        for (let i = 0; i < enemyBanList.length; i++) {
            let enemyBanChamp = enemyBanList[i];
            this.enemyBans[enemyBanChamp][resultKey]++;
        }
    }

    // Sort by most number of games
    sortWinrates(winrateObjs) {
        // Convert to total # games and win %
        let winrateArr = [];
        for (let curChampName in winrateObjs) {
            const nameCapitalized = curChampName.charAt(0).toUpperCase() + curChampName.slice(1);
            winrateObjs[curChampName].name = nameCapitalized;
            this.convertWinrates(winrateObjs[curChampName]);

            // If # games isn't 0, add data into arr
            if (winrateObjs[curChampName].games != 0) {
                winrateArr.push(winrateObjs[curChampName]);
            }
        }

        // Sort array by descending # games
        winrateArr.sort((a, b) => b.games - a.games);
        return winrateArr;
    }

    // Add "games" and "winrate" members to object
    convertWinrates(winrateObj) {
        winrateObj.games = winrateObj.wins + winrateObj.losses;

        // Get clean winrate int
        let winrate = winrateObj.wins / winrateObj.games;
        winrate = Math.round( winrate * 100);
        winrateObj.winrate = winrate;
    }

}