import winrateStyles from '../styles/winrateTable.module.css'
import { RoleHover } from './roleHover'

export function RoleTable({roles}) {
    return (
        <div className={winrateStyles.card}>
            <table className={winrateStyles.table}>
                <thead>
                    <tr>
                        <th>
                            <RoleHover champArr={roles[0].champArr}>
                                <img src="Top.png" className={winrateStyles.img}/> 
                            </RoleHover>
                        </th>
                        <th>
                            <RoleHover champArr={roles[1].champArr}> 
                                <img src="Jungle.png" className={winrateStyles.img}/> 
                            </RoleHover>
                        </th>
                        <th>
                            <RoleHover champArr={roles[2].champArr}>
                                <img src="Middle.png" className={winrateStyles.img}/>
                            </RoleHover>
                        </th>
                        <th>
                            <RoleHover champArr={roles[3].champArr}>
                                <img src="Bottom.png" className={winrateStyles.img}/>
                            </RoleHover>
                        </th>
                        <th>
                            <RoleHover champArr={roles[4].champArr}>
                                <img src="Support.png" className={winrateStyles.img}/>
                            </RoleHover>
                        </th>
                        <th>
                            <RoleHover champArr={roles[5].champArr}>
                                <img src="QuestionMark.png" className={winrateStyles.img} alt="Unsure" title="Unsure"/>
                            </RoleHover>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        {roles.map(role => (
                            <td key={role.name}>{role.games}</td>
                        ))}
                    </tr>
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