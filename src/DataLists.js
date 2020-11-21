import { urlGet, apiGet } from "./Request.js";

export async function getLatestVersion() {
    let versionList = await urlGet('https://ddragon.leagueoflegends.com/api/versions.json');
    if (versionList && versionList.length > 0) {
        return versionList[0];
    }
    else {
        console.log("Error, latest version not found");
        return "";
    }
}

export async function getChampionList() {
    let version = await getLatestVersion();
    let data = await urlGet('https://ddragon.leagueoflegends.com/cdn/' + version + '/data/en_US/champion.json');
    if (data) {
        return data.data;
    }
    else {
        return [];
    }
}

export async function getQueueList() {
    let data = await urlGet('https://static.developer.riotgames.com/docs/lol/queues.json');
    if (data) {
        return data;
    }
    else {
        return [];
    }
}