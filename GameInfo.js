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