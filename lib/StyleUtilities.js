export function getWinrateColor(winrate) {
    // Green
    if (winrate >= 60) {
        return {color: '#238823'};
    }
    // Red
    else if (winrate <= 40) {
        return {color: '#D2222D'};
    }
    else {
        return {};
    }
}