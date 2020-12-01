import { useRouter } from 'next/router';
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { SearchBar } from '../components/searchBar.js'
import { Clash } from '../lib/Clash.js'

export default function SummonerName({ summonerName, totals, winrateArr, roleWinrates, allyBanArr, enemyBanArr }) {

    if (totals == undefined) {
        return (<p>Is Undefined</p>)
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
                        Clash winrates for {summonerName}
                    </h1>
    
                    <SearchBar></SearchBar>
                
                    <h3>{totals.wins}, {totals.losses}</h3>
                    <div className={styles.grid}>
                        <ul className={styles.card}>
                            <h3>Champion, Wins, Losses</h3>
                            {winrateArr.map((matches) => (
                                <li>{matches.name}: {matches.wins}, {matches.losses}</li>
                            ))}
                        </ul>
                        
                        <ul className={styles.card}>
                            <h3>Role, Wins, Losses</h3>
                            {Object.keys(roleWinrates).map(key => (
                                <li>{key}: {roleWinrates[key].wins}, {roleWinrates[key].losses}</li>
                            ))}
                        </ul>
    
                        <ul className={styles.card}>
                            <h3>Ally bans, Wins, Losses</h3>
                            {allyBanArr.map((matches) => (
                                <li>{matches.name}: {matches.wins}, {matches.losses}</li>
                            ))}
                        </ul>
    
                        <ul className={styles.card}>
                            <h3>Enemy bans, Wins, Losses</h3>
                            {enemyBanArr.map((matches) => (
                                <li>{matches.name}: {matches.wins}, {matches.losses}</li>
                            ))}
                        </ul>
                    </div>
                </main>
            </div>
        )
    }
}

export async function getServerSideProps(context) {
    const { summonerName } = context.query;
    console.log(summonerName);
    const [totals, winrateArr, roleWinrates, allyBanArr, enemyBanArr] = await getClashData(summonerName);

    return { props: { summonerName, totals, winrateArr, roleWinrates, allyBanArr, enemyBanArr }}
}

async function getClashData (username) {
    const apiKey = process.env.API_KEY;
    if (apiKey == undefined) {
        console.log("Please create a .env file and add API_KEY to it");
        return;
    }
    else {
        const clash = new Clash;
        return await clash.run(username, apiKey);
    }
}