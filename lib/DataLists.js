import { Request } from "./Request.js";

export async function getLatestVersion() {
    let versionList = await Request.urlGet('https://ddragon.leagueoflegends.com/api/versions.json');
    if (versionList && versionList.length > 0) {
        return versionList[0];
    }
    else {
        console.log("Error, latest version not found", versionList);
        return "";
    }
}

export async function getChampionList() {
    let version = await getLatestVersion();
    let data = await Request.urlGet('https://ddragon.leagueoflegends.com/cdn/' + version + '/data/en_US/champion.json');
    if (data) {
        return data.data;
    }
    else {
        console.log("Error (getChampionList): champ list data not found", data);
        return [];
    }
}

export async function getQueueList() {
    let data = await Request.urlGet('https://static.developer.riotgames.com/docs/lol/queues.json');
    if (data) {
        return data;
    }
    else {
        console.log("Error (getQueueList): queue list data not found", data);
        return [];
    }
}