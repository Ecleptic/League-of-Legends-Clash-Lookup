import RankStyle from '../styles/Rank.module.css'

export function Rank({ranks}) {
    return (
        <div>
            {ranks.solo != undefined ?
                <div className={RankStyle.rankIconContainer}>
                    <p>Solo</p>
                    <img className={RankStyle.rankIcon} src={ranks.solo + ".png"} />
                </div>
                : null
            }
            {ranks.flex != undefined ?
                <div className={RankStyle.rankIconContainer}>
                    <p>Flex</p>
                    <img className={RankStyle.rankIcon} src={ranks.flex + ".png"} />
                </div>
                : null
            }
        </div>
    )
}
