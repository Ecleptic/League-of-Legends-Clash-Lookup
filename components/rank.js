import styles from '../styles/Home.module.css'

export function Rank({ranks}) {
    return (
        <div className={styles.grid}>
            {ranks.solo != undefined ?
                <div className={styles.rankIconContainer}>
                    <p>Solo</p>
                    <img className={styles.rankIcon} src={ranks.solo + ".png"} />
                </div>
                : null
            }
            {ranks.flex != undefined ?
                <div className={styles.rankIconContainer}>
                    <p>Solo</p>
                    <img className={styles.rankIcon} src={ranks.flex + ".png"} />
                </div>
                : null
            }
        </div>
    )
}
