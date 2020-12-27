import WinrateStyles from '../styles/WinrateTable.module.css'

export function TeamsTable({}) {

    const teams = [
        {
            players: [
                {
                    name: "a",
                    iconUrl: "Unsure.png",
                    role: "Unsure.png",
                },
                {
                    name: "a",
                    iconUrl: "Unsure.png",
                    role: "Unsure.png",
                },
                {
                    name: "a",
                    iconUrl: "Unsure.png",
                    role: "Unsure.png",
                },
                {
                    name: "a",
                    iconUrl: "Unsure.png",
                    role: "Unsure.png",
                },
                {
                    name: "a",
                    iconUrl: "Unsure.png",
                    role: "Unsure.png",
                },
            ],
            games: 10,
            winrate: 50,
        },
        {
            players: [
                {
                    name: "b",
                    iconUrl: "Unsure.png",
                    role: "Unsure.png",
                },
                {
                    name: "b",
                    iconUrl: "Unsure.png",
                    role: "Unsure.png",
                },
                {
                    name: "b",
                    iconUrl: "Unsure.png",
                    role: "Unsure.png",
                },
                {
                    name: "b",
                    iconUrl: "Unsure.png",
                    role: "Unsure.png",
                },
                {
                    name: "b",
                    iconUrl: "Unsure.png",
                    role: "Unsure.png",
                },
            ],
            games: 20,
            winrate: 30,
        }
    ];
    
    return (
        <div className={WinrateStyles.card}>
            <h3>Teams</h3>
            <table className={WinrateStyles.table}>
                <thead>
                    <th colSpan="10">Players</th>
                    <th>Games</th>
                    <th>Winrate</th>
                </thead>
                <tbody>
                    {teams.map(team => (
                        <tr key="a">
                            {/* Show players */}
                            {team.players.map(player => (
                                <>
                                    <td>{player.name}</td>
                                    {/* <td><img src={'../'+player.iconUrl} className={WinrateStyles.img}/></td> */}
                                    <td><img src={'../'+player.role} className={WinrateStyles.img}/></td>
                                </>
                            ))}

                            {/* Show # games/winrate */}
                            <td>{team.games}</td>
                            <td>{team.winrate}%</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}