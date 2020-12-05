//import axios from "axios";
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
            return this.cache[url];
        }

        // Get data from API
        const response = await fetch(url);
        const data = await response.json();

        // Check errors
        if (response.status != 200) {
            return await this.handleErrors(data, response, url);
        }

        // Successful response, reset retry count
        this.curTries = 0;

        // Add data to cache if it doesn't exist
        if (this.cache[url] == undefined) {
            this.cache[url] = data;
        }
        return data;
    }

    static async handleErrors(data, response, url) {
        // Check if we should retry
        let [retry, waitTime, errorMessage] = this.checkError(data, response, url);
        if (retry && waitTime <= 500) {
            // Sleep before retry
            console.log("sleeping for", waitTime, "milliseconds");
            await sleep(waitTime);
            return await Request.urlGet(url);
        }
        else {
            return {error: true, errorMessage};
        }
    }

    // Returns [retry, wait time (ms)]
    static checkError(data, response, url) {
        // Invalid response
        if (data.status == undefined) {
            console.log("Error (Request): invalid api response status");
            return [false, 0, "Invalid api response status"];
        }
        // API timeout
        else if (data.errno == -4039) {
            console.log("Error (Request): connection timeout");
            console.log("On url:", url);
            return [false, 0, "Connection timeout"];
        }

        // Default to retry
        let retry = true;
        let waitTime = 500;
        let errorCode = data.status.status_code;
        let errorMessage = data.status.message;

        switch (errorCode) {
            case 400: // Bad request
                retry = false;
                break;
            case 403: // Forbidden
                retry = false;
                errorMessage = "API key invalid";
                break;
            case 404: // Not found
                retry = false;
                break;
            case 429: // Rate limit exceeded
                let riotSleepTime = response.headers.get('Retry-After');
                if (riotSleepTime) {
                    waitTime = parseInt(riotSleepTime * 1000);
                }
                errorMessage = "API key timeout, retry in " + parseInt(Math.round(waitTime / 1000)) + " seconds";
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

        return [retry, waitTime, errorMessage];
    }
}



