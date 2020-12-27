import { Request } from "./Request.js";
import * as account from "./AccountInfo.js";
import { Match } from "./MatchInfo.js";
import * as gameInfo from "./GameInfo.js";

// Process all clash related data for one player
export class Clash {
    summonerName = "";
    key = "";

    matches;
    teams = {};
    teammates = {};
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
        const allMatchData = await this.getClashMatches(summonerName, key);
        if (allMatchData.error) {
            // Check if the error was no clash matches
            if (allMatchData.errorMessage == "Not found") {
                allMatchData.errorMessage = correctSummonerName + " has not not played any clash matches yet";
            }
            return allMatchData;
        }
        const matches = allMatchData.matches;

        // Get rank(s)
        const ranks = await this.getRankedInfo(summonerName, key);
    
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
            let teammates = await match.getTeammates(summonerName);

            // Print for progress bar
            process.stdout.write(".");
    
            // Initialize data if it doesn't already exist
            // Champions total
            await this.initWinrateData(this.champWinrates, champName);

            // Champions per role
            await this.initWinrateData(this.roleWinrates[role].champions, champName);

            // Enemy bans
            for (let ban of enemyBanList) {
                await this.initWinrateData(this.enemyBans, ban);
            }

            // Ally Bans
            for (let ban of allyBanList) {
                await this.initWinrateData(this.allyBans, ban);
            }

            // Teammates
            await this.initPlayerData(teammates);
    
            // Add win/loss data
            await this.addResult(result, champName, role, allyBanList, enemyBanList, teammates);
    
            // End of loop, print winrate object
            if (i == matches.length - 1) {
                // Sort data from most - least
                // And convert from W/L to # Games/Winrate
                this.convertWinrates(this.totals);
                const champArr = this.sortWinrates(this.champWinrates);
                const roles = this.sortRoles(this.roleWinrates);
                const allyBanArr = this.sortWinrates(this.allyBans);
                const enemyBanArr = this.sortWinrates(this.enemyBans);
                const teammateArr = this.sortWinrates(this.teammates);
                const teamsArr = this.sortWinrates(this.teams);
    
                console.log("\n", summonerName);
                console.log(this.totals);
                // console.log(this.teams);

                return {
                    name: correctSummonerName, 
                    totals: this.totals, 
                    ranks, 
                    roles, 
                    champArr, 
                    allyBanArr, 
                    enemyBanArr, 
                    teammates: teammateArr,
                    teams: teamsArr
                };
            }
        }
    }

    async initWinrateData(winrateObj, varName) {
        if (winrateObj[varName] == undefined) {
            winrateObj[varName] = {};
            winrateObj[varName].wins = 0;
            winrateObj[varName].losses = 0;

            // Add icon url
            winrateObj[varName].iconUrl = await gameInfo.getChampionIconUrl(varName);
        }
    }

    // Need to separate from initWinrateData() because the data is stored differently and the icon has a different url
    async initPlayerData(curTeammates) {
        // Init individual players
        for (let player of curTeammates) {
            if (this.teammates[player.name] == undefined) {
                this.teammates[player.name] = {};
                this.teammates[player.name].wins = 0;
                this.teammates[player.name].losses = 0;

                // Add icon url
                this.teammates[player.name].iconUrl = await gameInfo.getPlayerIconUrl(player.iconId);
            }
        }

        // Alphabetize player names and get unique key from concatenating them
        curTeammates.sort((a, b) => a.name.localeCompare(b.name));
        const teamKey = curTeammates.map(player => player.name).join("");

        // Init unique teams
        if (this.teams[teamKey] == undefined) {
            this.teams[teamKey] = {};
            this.teams[teamKey].wins = 0;
            this.teams[teamKey].losses = 0;
            this.teams[teamKey].players = curTeammates.map(player => player.name);
        }
    }

    async addResult(result, champName, role, allyBanList, enemyBanList, teammates) {
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

        // Teammates
        for (let teammate of teammates) {
            this.teammates[teammate.name][resultKey]++;
        }

        // Teams
        const teamKey = teammates.map(player => player.name).join("");
        this.teams[teamKey][resultKey]++;
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

    async getRankedInfo(summonerName, key) {
        const rankedInfo = await account.getRankedInfo(summonerName, key);
        const ranks = {};
        if (rankedInfo.error) {
            return ranks;
        }

        rankedInfo.forEach(rank => {
            // Convert tier from "GOLD" to "Gold", etc.
            const lowerTier = rank.tier.toLowerCase();
            const capitalTier = lowerTier.charAt(0).toUpperCase() + lowerTier.slice(1);

            // Only show solo/flex ranks
            if (rank.queueType == "RANKED_SOLO_5x5") {
                ranks.solo = capitalTier;
            }
            else if (rank.queueType == "RANKED_FLEX_SR") {
                ranks.flex = capitalTier;
            }
        });
        return ranks;
    }
}