import axios from "axios";
import {promisify} from "util";
const sleep = promisify(setTimeout);

export class Request {
    static maxTries = 3;
    static curTries = 0;
    static defaultSleepTime = 500;

    // Helper function for common request
    static async apiGet(path, key) {
        return await Request.urlGet('https://na1.api.riotgames.com' + path + '?api_key=' + key);
    }

    // Main api calling function
    static async urlGet(url) {
        try {
            const response = await axios.get(url);
            return response.data;
        } 
        catch (error) {
            // Limit number of retries
            if (this.curTries < this.maxTries) {
                this.curTries++;

                // Check if the api has given us a retry time limit
                let sleepTime = this.defaultSleepTime;
                let riotSleepTime = error.response.headers['retry-after'];
                if (riotSleepTime) {
                    sleepTime = parseInt(riotSleepTime * 1000);
                    console.log("sleeping for", sleepTime, "milliseconds");
                }
                await sleep(sleepTime);
                return await Request.urlGet(url);
                
            }
            else {
                console.log("Error (urlGet):", error.response.statusText);
                this.curTries = 0;
                return {};
            }
        }
    }
}



