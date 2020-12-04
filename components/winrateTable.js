import styles from '../styles/Home.module.css'

export function WinrateTable({type, dataArr}) {
  
    return (
        <div className={styles.card}>
            <table>
                <thead>
                    <tr>
                        <th>{type}</th>
                        <th>Games</th>
                        <th>Winrate</th>
                    </tr>
                </thead>
                <tbody style={{color: "black"}}>
                    {dataArr.map((matches) => (
                        <tr>
                            <td>{matches.name}</td>
                            <td>{matches.games}</td>
                            <td>{matches.winrate}%</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}