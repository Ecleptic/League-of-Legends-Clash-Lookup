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
    let champList = await lists.getChampionList();
    return getChampionNameFromList(champList, id);
}

export function getChampionNameFromList(champList, id) {
    // If there is no ban it registers as champ ID -1
    if (id == -1) {
        return "None";
    }

    for (let champKey in champList) {
        let champData = champList[champKey];

        if (champData.key == id) {
            return champData.name;
        }
        // Zyra is the last champ
        else if (champData.name == "Zyra") {
            console.log("Error (getChampionNameFromList): Couldn't find champ name in list", id);
            return "";
        }
    }
}