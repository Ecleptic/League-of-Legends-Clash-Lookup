import WinrateStyles from '../styles/WinrateTable.module.css'
import { getWinrateColor } from '../lib/StyleUtilities.js'

export function TeamsTable({teams}) {
    return (
        <div className={WinrateStyles.card}>
            <table className={WinrateStyles.table}>
                <tbody>
                    {/* Icons */}
                    <tr>
                        {roles.map(role => (
                            <td key={role.name}>
                                    <img src={role.name + '.png'} className={WinrateStyles.img} alt={role.name}/>
                            </td>
                        ))}
                    </tr>

                    {/* # games played */}
                    <tr>
                        {roles.map(role => (
                            <td key={role.name}>{role.games}</td>
                        ))}
                    </tr>

                    {/* Winrate */}
                    <tr>
                        {roles.map(role => (
                            <td style={getWinrateColor(role.winrate)} key={role.name}>{role.winrate}%</td>
                        ))}
                    </tr>
                </tbody>
            </table>
        </div>
    )
}