import TeamsStyle from '../styles/TeamsTable.module.css'
import { getWinrateColor } from '../lib/StyleUtilities.js'

export function TeamsTable({ teams }) {
    return (
        <div className={TeamsStyle.card}>
            <h3>Teams</h3>
            <table>
                {teams.map(team => (
                    <>
                        <tr>
                            <td>{team.players[0]}</td>
                            <td>{team.players[1]}</td>
                            <td>{team.games}</td>
                        </tr>
                        <tr>
                            <td>{team.players[2]}</td>
                            <td>{team.players[3]}</td>
                            <td style={getWinrateColor(team.winrate)}>{team.winrate}%</td>
                        </tr>
                    </>
                ))}
            </table>
        </div>
    )
}