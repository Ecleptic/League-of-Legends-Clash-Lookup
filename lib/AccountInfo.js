import { Request } from "./Request.js";

export async function getMatchHistory(summonerName, key) {
    let data = await getAccountId(summonerName, key);
    if (data.error) {
        return data;
    }

    return await getMatchHistoryById(data, key);
}

export async function getMatchHistoryById(accountId, key) {
    return await Request.apiGet('/lol/match/v4/matchlists/by-account/' + accountId, key);
}

export async function getEncryptedId(summonerName, key) {
    let data = await getAccountInfo(summonerName, key);
    if (data.error) {
        return data;
    }
    else {
        return data.id;
    }
}

export async function getAccountId(summonerName, key) {
    let data = await getAccountInfo(summonerName, key);
    if (data.error) {
        return data;
    }
    else {
        return data.accountId;
    }
}

// Lets you input something like "thecraftycorki" and get the correct name: "The Crafty Corki"
export async function getSummonerName(summonerName, key) {
    let data = await getAccountInfo(summonerName, key);
    if (data.error) {
        return data;
    }
    else {
        return data.name;
    }
}

export async function getAccountInfo(summonerName, key) {
    const encodedName = encodeURI(summonerName); // Encode the name to handle special characters
    return await Request.apiGet('/lol/summoner/v4/summoners/by-name/' + encodedName, key);
}

export async function getRankedInfo(summonerName, key) {
    const id = await getEncryptedId(summonerName, key);
    if (id.error) {
        return id;
    }
    else {
        return await Request.apiGet('/lol/league/v4/entries/by-summoner/' + id, key);
    }
    
}