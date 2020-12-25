import WinrateStyles from '../styles/WinrateTable.module.css'
import { RoleHover } from './RoleHover.js'
import { getWinrateColor } from '../lib/StyleUtilities.js'

export function RoleTable({roles}) {
    return (
        <div className={WinrateStyles.card}>
            <table className={WinrateStyles.table}>
                <tbody>
                    {/* Icons */}
                    <tr>
                        {roles.map(role => (
                            <td key={role.name}>
                                <RoleHover champArr={role.champArr}>
                                    <img src={role.name + '.png'} className={WinrateStyles.img} alt={role.name}/>
                                </RoleHover>
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