import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { SearchBar } from '../components/searchBar.js'
import { WinrateTable } from '../components/winrateTable.js'
import { Clash } from '../lib/Clash.js'

export default function SummonerName({ summonerName, totals, champArr, roleArr, allyBanArr, enemyBanArr }) {

    if (totals == undefined) {
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
                    <p>Because no API key is present</p>
    
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
                        Clash winrates for <span style={{color: "#0070f3"}}>{summonerName}</span>
                    </h1>
    
                    <SearchBar/>
                
                    <h3>{totals.games} games, {totals.winrate}% winrate</h3>

                    <div className={styles.grid}>
                        <WinrateTable type="Champion" dataArr={champArr}/>
                        <WinrateTable type="Role" dataArr={roleArr}/>
                        <WinrateTable type="Ally bans" dataArr={allyBanArr}/>
                        <WinrateTable type="Enemy bans" dataArr={enemyBanArr}/>
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
    if (data) {
        const [totals, champArr, roleArr, allyBanArr, enemyBanArr] = data;
        return { props: { summonerName, totals, champArr, roleArr, allyBanArr, enemyBanArr }}
    }
    else {
        return { props: {} };
    }
    
}

async function getClashData (username) {
    const apiKey = process.env.API_KEY;
    if (apiKey == undefined) {
        console.log("Please create a .env file and add API_KEY to it");
        return false;
    }
    else {
        const clash = new Clash;
        return await clash.run(username, apiKey);
    }
}