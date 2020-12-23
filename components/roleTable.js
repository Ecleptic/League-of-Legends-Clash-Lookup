import winrateStyles from '../styles/winrateTable.module.css'
import { RoleHover } from './roleHover'

export function RoleTable({roles}) {
    return (
        <div className={winrateStyles.card}>
            <table className={winrateStyles.table}>
                <tbody>
                    {/* Icons */}
                    <tr>
                        {roles.map(role => (
                            <td key={role.name}>
                                <RoleHover champArr={role.champArr}>
                                    <img src={role.name + '.png'} className={winrateStyles.img} alt={role.name}/>
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
                            <td key={role.name}>{role.winrate}%</td>
                        ))}
                    </tr>
                </tbody>
            </table>
        </div>
    )
}