import Head from 'next/head'
import styles from '../../styles/Home.module.css'
// Components
import { SearchBar } from '../../components/SearchBar.js'
import { WinrateTable } from '../../components/WinrateTable.js'
import { TeamsTable } from '../../components/TeamsTable.js'
// Libraries
import { Clash } from '../../lib/Clash.js'

export default function Teams({ error, errorMessage, name, ranks, totals, champArr, roles, allyBanArr, enemyBanArr, teammates, teams }) {
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
                        <span style={{ color: "#0070f3" }}>{name}'s</span> clash teams
                    </h1>

                    <SearchBar />
                    <div className={styles.grid}>
                        <TeamsTable teams={teams}/>
                        <WinrateTable title="Teammates" colTitle="Teammate" dataArr={teammates} />
                        
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
        const { name, totals, ranks, roles, champArr, allyBanArr, enemyBanArr, teammates, teams } = data;
        return { props: { name, totals, ranks, roles, champArr, allyBanArr, enemyBanArr, teammates, teams } }
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