import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { SearchBar } from '../components/searchBar.js'
import { WinrateTable } from '../components/winrateTable.js'
import { RoleTable } from '../components/roleTable.js'
import { Clash } from '../lib/Clash.js'

export default function SummonerName({ error, errorMessage, name, totals, champArr, roles, allyBanArr, enemyBanArr }) {
    if (error) {
        return (
            <div className={styles.container}>
                <Head>
                    <title>Clash winrates</title>
                    <link rel="icon" href="/favicon.ico" />
                </Head>
            
                <main className={styles.main}>
                    <h1 className={styles.title}>
                        Clash winrates for <span style={{color: "#0070f3"}}>no one</span>
                    </h1>
                    <p>{errorMessage}</p>
    
                    <SearchBar/>
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
                        Clash winrates for <span style={{color: "#0070f3"}}>{name}</span>
                    </h1>
    
                    <SearchBar/>
                
                    <h3>{totals.games} games, {totals.winrate}% winrate</h3>
                    <RoleTable roles={roles}/>

                    <div className={styles.grid}>
                        <WinrateTable title="Champion" colTitle="Champion" dataArr={champArr}/>
                        <WinrateTable title="Enemy bans" colTitle="Champion" dataArr={enemyBanArr}/>
                        <WinrateTable title="Ally bans" colTitle="Champion" dataArr={allyBanArr}/>
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
        return { props: data};
    }
    else {
        const {name, totals, roles, champArr, allyBanArr, enemyBanArr} = data;
        return { props: { name, totals, roles, champArr, allyBanArr, enemyBanArr }}
    }   
}

async function getClashData (username) {
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