import axios from "axios";
import {promisify} from "util";
const sleep = promisify(setTimeout);

export class Request {
    // Throttle info
    static maxTries = 3;
    static curTries = 0;
    static defaultSleepTime = 500;

    // Cache
    static cache = {};

    // Helper function for common request
    static async apiGet(path, key) {
        return await Request.urlGet('https://na1.api.riotgames.com' + path + '?api_key=' + key);
    }

    // Main api calling function
    static async urlGet(url) {
        // Check if data is in cache
        if (this.cache[url] != undefined) {
            return this.cache[url].data;
        }

        // Get data from API
        try {
            const response = await axios.get(url);

            // Add data to cache if it doesn't exist
            if (this.cache[url] == undefined) {
                this.cache[url] = response;
            }
            return response.data;
        } 
        catch (error) {
            // Limit number of retries
            if (this.curTries < this.maxTries) {
                this.curTries++;

                // Check timeout error
                if (error.errno == -4039) {
                    console.log("Error (Request): connection timeout");
                    console.log("On url:", url);
                    return {};
                }

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
                console.log("On url:", url);
                this.curTries = 0;
                return {};
            }
        }
    }
}



