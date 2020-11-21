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
    return getChampionNameFromList(champList);
}

export function getChampionNameFromList(champList, id) {
    for (let champKey in champList) {
        let champData = champList[champKey];

        if (champData.key == id) {
            return champData.name;
        }
        // Zyra is the last champ
        else if (champData.name == "Zyra") {
            console.log("Error (getChampionNameFromList): Couldn't find champ name in list");
            return "";
        }
    }
}