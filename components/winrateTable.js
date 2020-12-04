import styles from '../styles/Home.module.css'

export function WinrateTable({type, dataArr}) {
  
    return (
        <div className={styles.card}>
            <h3>{type}, Games, Winrate</h3>
            <ul>
                {dataArr.map((matches) => (
                    <li style={{color: "black"}}>{matches.name}: {matches.games}, {matches.winrate}%</li>
                ))}
            </ul>
        </div>
    )
}