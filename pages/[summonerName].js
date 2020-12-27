import Head from 'next/head'
import styles from '../styles/Home.module.css'
// Components
import { SearchBar } from '../components/SearchBar.js'
import { Rank } from '../components/Rank.js'
import { WinrateTable } from '../components/WinrateTable.js'
import { RoleTable } from '../components/RoleTable.js'
// Libraries
import { Clash } from '../lib/Clash.js'

export default function SummonerName({ error, errorMessage, name, ranks, totals, champArr, roles, allyBanArr, enemyBanArr, teammates }) {
    if (error) {
        return (
            <div className={styles.container}>
                <Head>
                    <title>Clash winrates</title>
                    <link rel="icon" href="/favicon.ico" />
                </Head>

                <main className={styles.main}>
                    <h1 className={styles.title}>
                        Clash winrates for <span style={{ color: "#0070f3" }}>no one</span>
                    </h1>
                    <p>{errorMessage}</p>

                    <SearchBar />
                </main>
            </div>
        )
    }
    else {
        return (
            <div className={styles.container}>
                <Head>
                    <title>Clash winrates</title>
                    <link rel="icon" href="/favicon.ico" />
                </Head>

                <main className={styles.main}>
                    <h1 className={styles.title}>
                        Clash winrates for <span style={{ color: "#0070f3" }}>{name}</span>
                    </h1>

                    <SearchBar />
                    <Rank ranks={ranks}/>

                    <h3>{totals.games} games, {totals.winrate}% winrate</h3>
                    <RoleTable roles={roles} />

                    <div className={styles.grid}>
                        <WinrateTable title="Champions" colTitle="Champion" dataArr={champArr} />
                        <WinrateTable title="Enemy bans" colTitle="Champion" dataArr={enemyBanArr} />
                        <WinrateTable title="Ally bans" colTitle="Champion" dataArr={allyBanArr} />
                    </div>
                    <div className={styles.card}>
                        Clash Tips© isn't endorsed by Riot Games and doesn't reflect the views or opinions of Riot Games
                        or anyone officially involved in producing or managing Riot Games properties. Riot Games, and all
                        associated properties are trademarks or registered trademarks of Riot Games, Inc.
                    </div>
                </main>
            </div>
        )
    }
}

export async function getServerSideProps(context) {
    const { summonerName } = context.query;
    console.log(summonerName);

    const data = await getClashData(summonerName);

    if (data.error) {
        return { props: data };
    }
    else {
        const { name, totals, ranks, roles, champArr, allyBanArr, enemyBanArr, teammates } = data;
        return { props: { name, totals, ranks, roles, champArr, allyBanArr, enemyBanArr, teammates } }
    }
}

async function getClashData(username) {
    const apiKey = process.env.API_KEY;
    if (apiKey == undefined) {
        console.log("Please create a .env file and add API_KEY to it");
        return { errorText: "API key has not been added" };
    }
    else {
        const clash = new Clash;
        return await clash.run(username, apiKey);
    }
}