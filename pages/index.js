import Head from 'next/head'
import { useState } from 'react'
import styles from '../styles/Home.module.css'
import { Clash } from '../lib/Clash.js'

export async function getServerSideProps () {
    const apiKey = process.env.API_KEY;
    if (apiKey == undefined) {
        console.log("Please create a .env file and add API_KEY to it");

        return;
    }
    else {
        const clash = new Clash;
        const username = "The Crafty Corki";
        const [totals, winrateArr, roleWinrates, allyBanArr, enemyBanArr] = await clash.run(username, apiKey);
        return {
            props: {
                username,
                totals,
                winrateArr,
                roleWinrates,
                allyBanArr,
                enemyBanArr,
            },
        }
    }
}

function MyComponent({ summonerName, onSearch }) {
    const [newName, setNewName] = useState(summonerName)
  
    return (
        <div className={styles.card}>
        <input 
          type="text" 
          placeholder="Summoner Name" 
          onChange={(e) => setNewName(e.target.value)} 
        />
        <button onClick={() => console.log(newName)}>Search</button>
        </div>
    )
  }

export default function Home({ username, totals, winrateArr, roleWinrates, allyBanArr, enemyBanArr }) {

    return (
        <div className={styles.container}>
            <Head>
            <title>Clash Lookup</title>
            <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className={styles.main}>
            <MyComponent></MyComponent>

            <h1 className={styles.title}>
                Clash winrates for <a href="">{username}</a>
            </h1>

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

            {/*
            <p className={styles.description}>
                Get started by editing{' '}
                <code className={styles.code}>pages/index.js</code>
            </p>

            <div className={styles.grid}>
                <a href="https://nextjs.org/docs" className={styles.card}>
                <h3>Documentation &rarr;</h3>
                <p>Find in-depth information about Next.js features and API.</p>
                </a>

                <a href="https://nextjs.org/learn" className={styles.card}>
                <h3>Learn &rarr;</h3>
                <p>Learn about Next.js in an interactive course with quizzes!</p>
                </a>

                <a
                href="https://github.com/vercel/next.js/tree/master/examples"
                className={styles.card}
                >
                <h3>Examples &rarr;</h3>
                <p>Discover and deploy boilerplate example Next.js projects.</p>
                </a>

                <a
                href="https://vercel.com/import?filter=next.js&utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
                className={styles.card}
                >
                <h3>Deploy &rarr;</h3>
                <p>
                    Instantly deploy your Next.js site to a public URL with Vercel.
                </p>
                </a>
            </div>
            */}
            </main>

            {/*
            <footer className={styles.footer}>
            <a
                href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
                target="_blank"
                rel="noopener noreferrer"
            >
                Powered by{' '}
                <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
            </a>
            </footer>
            */}
        </div>
  )
}