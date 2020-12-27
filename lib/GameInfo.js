import * as lists from "./DataLists.js";

export async function getQueue(id) {
    let queueList = await lists.getQueueList();
    for (let i = 0; i < queueList.length; i++) {
        if (queueList[i].queueId == id) {
            return queueList[i];
        }
        else if (i == queueList.length - 1) {
            return {};
        }
    }
}

export async function getChampionName(id) {
    const champList = await lists.getChampionList();
    const champData = getChampionDataFromList(champList, id);
    return champData.name;
}

export async function getChampionIconUrl(champName) {
    const version = await lists.getLatestVersion();
    const champList = await lists.getChampionList();
    
    // No URL for these
    if (champName == "" || champName == "None") {
        return "";
    }

    // Get last key for error checking
    const objKeys = Object.keys(champList);
    const lastKey = champList[objKeys[objKeys.length - 1]];

    for (let champKey in champList) {
        let champData = champList[champKey];

        if (champData.name == champName) {
            const imgName = champData.image.full;
            return ('https://ddragon.leagueoflegends.com/cdn/' + version + '/img/champion/' + imgName);
        }
        // Return if last key failed
        else if (champKey == lastKey) {
            console.log("Error (getChampionSquareUrl): Couldn't find champ key in list", champName);
            return "";
        }
    }
}

export async function getPlayerIconUrl(id) {
    const version = await lists.getLatestVersion();
    return ('https://ddragon.leagueoflegends.com/cdn/' + version + '/img/profileicon/' + id + '.png');
}

export function getChampionDataFromList(champList, id) {
    // If there is no ban it registers as champ ID -1
    if (id == -1) {
        return {name: "None", key: "None"};
    }

    // Get last key for error checking
    const objKeys = Object.keys(champList);
    const lastKey = champList[objKeys[objKeys.length - 1]];

    for (let champKey in champList) {
        let champData = champList[champKey];

        if (champData.key == id) {
            return champData;
        }
        // Return if last key failed
        else if (champKey == lastKey) {
            console.log("Error (getChampionNameFromList): Couldn't find champ name in list", id);
            return {name: "", key: ""};
        }
    }
}