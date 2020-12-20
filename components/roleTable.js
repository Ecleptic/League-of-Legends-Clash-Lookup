import winrateStyles from '../styles/winrateTable.module.css'

export function RoleTable({roles}) {
    return (
        <div className={winrateStyles.card}>
            <table className={winrateStyles.table}>
                <thead>
                    <tr>
                        <th><img src="Top.png" style= {{width: '50px', height: '50px'}}/></th>
                        <th><img src="Jungle.png" style= {{width: '50px', height: '50px'}}/></th>
                        <th><img src="Middle.png" style= {{width: '50px', height: '50px'}}/></th>
                        <th><img src="Bottom.png" style= {{width: '50px', height: '50px'}}/></th>
                        <th><img src="Support.png" style= {{width: '50px', height: '50px'}}/></th>
                        <th><img src="QuestionMark.png" style= {{width: '50px', height: '50px'}} alt="Unsure" title="Unsure"/></th>
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