import hoverStyles from '../styles/hoverCard.module.css'
import winrateStyles from '../styles/winrateTable.module.css'
import { useState } from 'react'

export function RoleHover({children, champArr}) {
    const [show, setShow] = useState();

    return (
        <div className={hoverStyles.container}>
            <div 
                display="block"
                height="auto"
                width="100%"
                onMouseEnter={() => setShow(true)}
                onMouseLeave={() => setShow(false)}>

                {children}
            </div>
            {show ? 
                <div className={hoverStyles.overlay}>
                    <table>
                        {champArr.map((champ) => (
                            <tr key={champ.name}>
                                <td>
                                    <img src={champ.iconUrl} className={winrateStyles.img} alt={champ.name}/>
                                </td>
                                <td>{champ.name}</td>
                                <td>{champ.games}</td>
                                <td>{champ.winrate}%</td>
                            </tr>
                        ))}
                    </table>
                </div>
            : null}
        </div>
    )
}