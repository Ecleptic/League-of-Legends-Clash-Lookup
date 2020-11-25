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

            // Successful response, reset retry count
            this.curTries = 0;

            // Add data to cache if it doesn't exist
            if (this.cache[url] == undefined) {
                this.cache[url] = response;
            }
            return response.data;
        } 
        catch (error) {
            // Check if we should retry
            let [retry, waitTime] = this.checkError(error, url);
            if (retry) {
                // Sleep before retry
                console.log("sleeping for", waitTime, "milliseconds");
                await sleep(waitTime);
                return await Request.urlGet(url);
            }
            else {
                return false;
            }
        }
    }

    // Returns [retry, wait time (ms)]
    static checkError(error, url) {
        // Invalid response
        if (error.response == undefined) {
            console.log("Error (Request): invalid api response");
            return [false, 0];
        }
        // API timeout
        else if (error.errno == -4039) {
            console.log("Error (Request): connection timeout");
            console.log("On url:", url);
            return [false, 0];
        }

        // Default to retry
        let retry = true;
        let waitTime = 500;
        let errorCode = error.response.data.status.status_code;
        let errorMessage = error.response.data.status.message;

        switch (errorCode) {
            case 400: // Bad request
            case 404: // Not found
                retry = false;
                break;
            case 429: // Rate limit exceeded
                let riotSleepTime = error.response.headers['retry-after'];
                if (riotSleepTime) {
                    waitTime = parseInt(riotSleepTime * 1000);
                }
                break;
        }

        // Limit number of retries
        if (retry && this.curTries < this.maxTries) {
            this.curTries++;
        }
        // Show error message if no retry
        else {
            retry = false;
            console.log("Error (Request):", errorCode, errorMessage);
        }

        return [retry, waitTime];
    }
}



