import HoverStyles from '../styles/HoverCard.module.css'
import WinrateStyles from '../styles/WinrateTable.module.css'
import { getWinrateColor } from '../lib/StyleUtilities.js'
import { useState } from 'react'

export function RoleHover({ children, champArr }) {
    const [show, setShow] = useState();

    return (
        <div>
            <div
                onMouseEnter={() => setShow(true)}
                onMouseLeave={() => setShow(false)}>

                {children}
            </div>

            {/* On hover show champs of this role, prevent showing an empty box if the champArr is empty */}
            {(show && champArr.length != 0) ?
                <>
                    <div className={HoverStyles.triangle}></div>
                    <div className={HoverStyles.overlay}>
                        <table>
                            <thead></thead>
                            <tbody>
                                {champArr.map((champ) => (
                                    <tr key={champ.name}>
                                        <td>
                                            <img src={champ.iconUrl} className={WinrateStyles.img} alt={champ.name} />
                                        </td>
                                        <td>{champ.name}</td>
                                        <td>{champ.games}</td>
                                        <td style={getWinrateColor(champ.winrate)}>{champ.winrate}%</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
                : null}
        </div>
    )
}