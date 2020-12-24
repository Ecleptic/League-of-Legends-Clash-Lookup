import { Request } from "./Request.js";
import * as account from "./AccountInfo.js";
import { Match } from "./MatchInfo.js";
import * as gameInfo from "./GameInfo.js";

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
            champions: {},
        },
        jungle: {
            wins: 0,
            losses: 0,
            champions: {},
        },
        middle: {
            wins: 0,
            losses: 0,
            champions: {},
        },
        bottom: {
            wins: 0,
            losses: 0,
            champions: {},
        },
        support: {
            wins: 0,
            losses: 0,
            champions: {},
        },
        unsure: {
            wins: 0,
            losses: 0,
            champions: {},
        },
        // none: {
        //     wins: 0,
        //     losses: 0,
        // },
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
        const correctSummonerName = await account.getSummonerName(summonerName, key);
        let allMatchData = await this.getClashMatches(summonerName, key);
        if (allMatchData.error) {
            // Check if the error was no clash matches
            if (allMatchData.errorMessage == "Not found") {
                allMatchData.errorMessage = correctSummonerName + " has not not played any clash matches yet";
            }
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
            await this.initWinrateData(this.champWinrates, champName);

            // Enemy bans
            for (let i = 0; i < enemyBanList.length; i++) {
                let enemyBanChamp = enemyBanList[i];
                await this.initWinrateData(this.enemyBans, enemyBanChamp);
            }
            // Ally Bans
            for (let i = 0; i < allyBanList.length; i++) {
                let allyBanChamp = allyBanList[i];
                await this.initWinrateData(this.allyBans, allyBanChamp);
            }
    
            // Add win/loss data
            await this.addResult(result, champName, role, allyBanList, enemyBanList);
    
            // End of loop, print winrate object
            if (i == matches.length - 1) {
                // Sort data from most - least
                // And convert from W/L to # Games/Winrate
                this.convertWinrates(this.totals);
                let champArr = this.sortWinrates(this.champWinrates);
                let roles = this.sortRoles(this.roleWinrates);
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

                return {name: correctSummonerName, totals:this.totals, roles, champArr, allyBanArr, enemyBanArr};
            }
        }
    }

    async initWinrateData(winrateObj, varName) {
        if (winrateObj[varName] == undefined) {
            winrateObj[varName] = {};
            winrateObj[varName].wins = 0;
            winrateObj[varName].losses = 0;

            // Add url
            winrateObj[varName].iconUrl = await gameInfo.getChampionIconUrl(varName);
        }
    }

    async addResult(result, champName, role, allyBanList, enemyBanList) {
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

        // Role results
        if (this.roleWinrates[role] == undefined) {
            console.log("role winrates: ", this.roleWinrates, "role", role);
        }
        else {
            this.roleWinrates[role][resultKey]++;

            // Add champ results for this role
            if (this.roleWinrates[role].champions[champName] == undefined) {
                this.roleWinrates[role].champions[champName] = {
                    wins: 0,
                    losses: 0,
                    iconUrl: await gameInfo.getChampionIconUrl(champName),
                }
            }
            this.roleWinrates[role].champions[champName][resultKey]++;
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

    // Convert to total # games and win %, don't sort by # games
    sortRoles(rolesObj) {
        let winrateArr = [];
        for (let role in rolesObj) {
            // Add capitalized name
            const capitalizedName = role.charAt(0).toUpperCase() + role.slice(1);
            rolesObj[role].name = capitalizedName;
            // Add # games/winrate
            this.convertWinrates(rolesObj[role]);

            // Now do it for each champ played in the role
            let champArr = [];
            for (let champ in rolesObj[role].champions) {
                rolesObj[role].champions[champ].name = champ;
                this.convertWinrates(rolesObj[role].champions[champ]);
                champArr.push(rolesObj[role].champions[champ]);
            }
            
            // Sort by games played
            champArr.sort((a, b) => b.games - a.games);
            rolesObj[role].champArr = champArr;

            // Add everything into the array
            winrateArr.push(rolesObj[role]);
        }
        return winrateArr;
    }

    // Add "games" and "winrate" members to object
    convertWinrates(winrateObj) {
        winrateObj.games = winrateObj.wins + winrateObj.losses;

        // Get clean winrate int
        if (winrateObj.games == 0) {
            winrateObj.winrate = "∞";
        }
        else {
            let winrate = winrateObj.wins / winrateObj.games;
            winrate = Math.round( winrate * 100);
            winrateObj.winrate = winrate;
        }
    }
}