import { Request } from "./Request.js";
import * as account from "./AccountInfo.js";
import { Match } from "./MatchInfo.js";

// Process all clash related data for one player
export class Clash {
    summonerName = "";
    key = "";

    matches;
    champWinrates = {};
    totals = {
        wins: 0,
        losses: 0,
    }
    allyBans = {};
    enemyBans = {};

    async getClashMatches(summonerName, key) {
        // Get account ID from username
        let accountId = await account.getAccountId(summonerName, key);
        if (accountId == "") {
            return false;
        }

        // Get list of matches
        let data = await Request.urlGet('https://na1.api.riotgames.com/lol/match/v4/matchlists/by-account/' + accountId + '?queue=700&api_key=' + key);
        if (data) {
            return data;
        }
        else {
            return false;
        }
    }

    async run(summonerName, key) {
        let allMatchData = await this.getClashMatches(summonerName, key);
        let matches = allMatchData.matches;
        if (matches == undefined) {
            console.log("Error (Clash): matches are undefined");
            return;
        }
    
        // Print out string of dots for progress comparison
        console.log(".".repeat(matches.length));
    
        for (let i = 0; i < matches.length; i++) {
            //let matchData = await getMatchData(matches[i].gameId, key);
    
            //let match = new Match(matchData);
            let match = new Match;
            await match.init(matches[i].gameId, key);
    
            let champName = await match.getChampionName(summonerName);
            let allyBanList = await match.getAllyBans(summonerName);
            let enemyBanList = await match.getEnemyBans(summonerName);
            let result = match.getResult(summonerName);
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
            this.addResult(result, champName, allyBanList, enemyBanList);
    
            // End of loop, print winrate object
            if (i == matches.length - 1) {
                // Sort data from most - least
                let winrateArr = this.sortWinrates(this.champWinrates);
                let allyBanArr = this.sortWinrates(this.allyBans);
                let enemyBanArr = this.sortWinrates(this.enemyBans);
    
                console.log("\n", summonerName);
                console.log(this.totals);
    
                console.log("\nChampion picks");
                console.log(winrateArr);
    
                console.log("\nAlly team bans");
                console.log(allyBanArr);
    
                console.log("\nEnemy team bans")
                console.log(enemyBanArr);
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

    addResult(result, champName, allyBanList, enemyBanList) {
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
    sortWinrates(winrateObj) {
        // Put object into an array
        let winrateArr = [];
        for (let curChampName in winrateObj) {
            winrateObj[curChampName].name = curChampName;
            winrateArr.push(winrateObj[curChampName]);
        }

        // Sort array
        winrateArr.sort((a, b) => {
            return (b.wins+b.losses) - (a.wins+a.losses);
        });
        return winrateArr;
    }

}