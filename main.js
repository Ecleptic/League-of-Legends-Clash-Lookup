const https = require('https')
const options = {
    hostname: 'na1.api.riotgames.com',
    path: '/lol/summoner/v4/summoners/by-name/The%20Crafty%20Corki?api_key=RGAPI-938889fe-a454-44d8-a117-3a90e52626da',
    method: 'GET'
}

const req = https.request(options, res => {
    console.log(`statusCode: ${res.statusCode}`)

    // Data is received as binary, store it and convert to json
    let data = [];
    res.on('data', d => {
        data.push(d);
    })
    .on('end', () => {
        let buffer = Buffer.concat(data);
        let strBuffer = buffer.toString('utf8');
        let json = JSON.parse(strBuffer)
        console.log(json);
    });
})

req.on('error', error => {
    console.error(error)
})

req.end()