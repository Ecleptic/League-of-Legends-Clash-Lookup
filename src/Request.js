import axios from "axios";

export async function urlGet(url) {
    try {
        const response = await axios.get(url);
        return response.data;
    } 
    catch (error) {
        console.log(error.response.body);
        return {};
    }
}

export async function apiGet(path, key) {
    return await urlGet('https://na1.api.riotgames.com' + path + '?api_key=' + key);
}