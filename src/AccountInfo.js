import { Request } from "./Request.js";

export async function getMatchHistory(summonerName, key) {
    let accountId = await getAccountId(summonerName, key);
    return await getMatchHistoryById(accountId, key);
}

export async function getMatchHistoryById(accountId, key) {
    let data = await Request.apiGet('/lol/match/v4/matchlists/by-account/' + accountId, key);
    if (data) {
        return data;
    }
    else {
        return [];
    }
}

export async function getPuuid(summonerName, key) {
    let data = await getAccountInfo(summonerName, key);
    if (data) {
        return data.puuid;
    }
    else {
        return "";
    }
}

export async function getEncryptedId(summonerName, key) {
    let data = await getAccountInfo(summonerName, key);
    if (data) {
        return data.id;
    }
    else {
        return "";
    }
}

export async function getAccountId(summonerName, key) {
    let data = await getAccountInfo(summonerName, key);
    if (data) {
        return data.accountId;
    }
    else {
        return "";
    }
}

export async function getAccountInfo(summonerName, key) {
    let data = await Request.apiGet('/lol/summoner/v4/summoners/by-name/' + summonerName, key);
    if (data) {
        return data;
    }
    else {
        console.log("Error, could not find the requested account:", summonerName);
        return false;
    }
}