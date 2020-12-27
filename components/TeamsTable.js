import TeamsStyle from '../styles/TeamsTable.module.css'

export function TeamsTable({teams}) {

    // const teams = [
    //     {
    //         players: [
    //             {
    //                 name: "player a",
    //                 iconUrl: "Unsure.png",
    //                 role: "Unsure.png",
    //             },
    //             {
    //                 name: "player b",
    //                 iconUrl: "Unsure.png",
    //                 role: "Unsure.png",
    //             },
    //             {
    //                 name: "c",
    //                 iconUrl: "Unsure.png",
    //                 role: "Unsure.png",
    //             },
    //             {
    //                 name: "the player d",
    //                 iconUrl: "Unsure.png",
    //                 role: "Unsure.png",
    //             },
    //         ],
    //         games: 10,
    //         winrate: 50,
    //     },
    //     {
    //         players: [
    //             {
    //                 name: "player alpha",
    //                 iconUrl: "Unsure.png",
    //                 role: "Unsure.png",
    //             },
    //             {
    //                 name: "beta",
    //                 iconUrl: "Unsure.png",
    //                 role: "Unsure.png",
    //             },
    //             {
    //                 name: "the player delta",
    //                 iconUrl: "Unsure.png",
    //                 role: "Unsure.png",
    //             },
    //             {
    //                 name: "epsilon",
    //                 iconUrl: "Unsure.png",
    //                 role: "Unsure.png",
    //             },
    //         ],
    //         games: 20,
    //         winrate: 30,
    //     }
    // ];

    return (
        <div className={TeamsStyle.card}>
            <h3>Teams</h3>
            <table className={TeamsStyle.table} style={{width: "100%"}}>
                <thead style={{ whiteSpace: 'normal'}}>
                    <tr>
                        <th>Player 1</th>
                        <th>Player 2</th>
                        <th>Player 3</th>
                        <th>Player 4</th>
                        <th>Games</th>
                        <th>Winrate</th>
                    </tr>
                </thead>
                <tbody>
                    {teams.map(team => (
                        <tr key={team.name}>
                            {/* Show players */}
                            {team.players.map(player => (
                                <>
                                    <td>{player}</td>
                                    {/* <td><img src={'../'+player.iconUrl} className={WinrateStyles.img}/></td> */}
                                    {/* <td><img src={'../'+player.role} className={WinrateStyles.img}/></td> */}
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