import axios from "axios";
import {promisify} from "util";
const sleep = promisify(setTimeout);

const maxTries = 3;
let curTries = 0;

export async function urlGet(url) {
    try {
        const response = await axios.get(url);
        return response.data;
    } 
    catch (error) {
        // Limit number of retries
        if (curTries < maxTries) {
            curTries++;

            // Check if the api has given us a retry time limit
            let sleepTime = 500;
            let riotSleepTime = error.response.headers['retry-after'];
            if (riotSleepTime) {
                sleepTime = parseInt(riotSleepTime * 1000);
                console.log("sleeping for", sleepTime, "seconds");
            }
            await sleep(sleepTime);
            return await urlGet(url);
            
        }
        else {
            console.log("Error (urlGet):", error.response.statusText);
            curTries = 0;
            return {};
        }
    }
}

export async function apiGet(path, key) {
    return await urlGet('https://na1.api.riotgames.com' + path + '?api_key=' + key);
}